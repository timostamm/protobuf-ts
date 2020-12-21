import {MethodInfo, RpcError, RpcInputStream, RpcMetadata, RpcOutputStream} from "@protobuf-ts/runtime-rpc";
import * as grpc from "@grpc/grpc-js";
import {ServiceInfo} from "../runtime-rpc";
import {assert, listEnumValues} from "@protobuf-ts/runtime";
import {ServerCallContext} from "./idea-runtime-rpc";


// TODO provide in @protobuf-ts/grpc-backend


/**
 * Create a grpc service definition and an implementation for @grpc/grpc-js.
 */
export function adaptService(serviceInfo: ServiceInfo, serviceImplementation: any): [grpc.ServiceDefinition, grpc.UntypedServiceImplementation] {
    return [
        createDefinition(serviceInfo),
        mapService(serviceInfo, serviceImplementation)
    ];
}


/**
 * Create a service definition for @grpc/grpc-js from service info.
 */
function createDefinition(serviceInfo: ServiceInfo): grpc.ServiceDefinition {
    const def: { [k: string]: grpc.MethodDefinition<any, any> } = {};
    for (let mi of serviceInfo.methods) {
        def[mi.localName] = {
            path: `/${serviceInfo.typeName}/${mi.name}`,
            originalName: mi.name,
            requestStream: mi.clientStreaming,
            responseStream: mi.serverStreaming,
            responseDeserialize: bytes => mi.O.fromBinary(bytes),
            requestDeserialize: bytes => mi.I.fromBinary(bytes),
            responseSerialize: value => Buffer.from(mi.O.toBinary(value)),
            requestSerialize: value => Buffer.from(mi.I.toBinary(value)),
        };
    }
    return def;
}


type UnaryMethod<I extends object, O extends object> = (request: I, context: ServerCallContext) => Promise<O>;
type ServerStreamingMethod<I extends object, O extends object> = (request: I, response: RpcInputStream<O>, context: ServerCallContext) => Promise<void>;
type ClientStreamingMethod<I extends object, O extends object> = (requestStream: RpcOutputStream<I>, context: ServerCallContext) => Promise<O>;
type BidiMethod<I extends object, O extends object> = (requestStream: RpcOutputStream<I>, responseStream: RpcInputStream<O>, context: ServerCallContext) => Promise<void>;


/**
 * Create a grpc service implementation that delegates to the given
 * protobuf-ts service implementation.
 */
function mapService(serviceInfo: ServiceInfo, service: any): grpc.UntypedServiceImplementation {
    const grpcImp: grpc.UntypedServiceImplementation = {};
    for (let mi of serviceInfo.methods) {
        assert(typeof service[mi.localName] == "function", `implementation is missing method ${mi.localName}()`);

        if (mi.serverStreaming && mi.clientStreaming) {

            // TODO

        } else if (mi.serverStreaming) {

            grpcImp[mi.localName] = mapServerStreaming(mi, service[mi.localName] as ServerStreamingMethod<object, object>)

        } else if (mi.clientStreaming) {

            // TODO

        } else {
            grpcImp[mi.localName] = mapUnary(mi, service[mi.localName] as UnaryMethod<object, object>)
        }
    }
    return grpcImp;
}


function mapUnary<I extends object, O extends object>(methodInfo: MethodInfo, method: UnaryMethod<I, O>): grpc.handleUnaryCall<I, O> {
    return async (call: grpc.ServerUnaryCall<I, O>, callback: grpc.sendUnaryData<O>) => {

        const deadlineGrpc = call.getDeadline();
        const deadlineDate = typeof deadlineGrpc === 'number' ? new Date(deadlineGrpc) : deadlineGrpc;

        const context: ServerCallContext = {
            method: methodInfo,
            headers: grpcMetaToRpc(call.metadata),
            sendResponseHeaders(data) {
                call.sendMetadata(rpcMetaToGrpc(data));
            },
            status: {
                code: grpc.status[grpc.status.OK],
                detail: ''
            },
            trailers: {},
            deadline: deadlineDate,
        };

        let response: O;
        try {
            response = await method(call.request, context);
        } catch (e) {
            if (e instanceof RpcError) {

                const grpcStatusCode = rpcCodeToGrpc(e.code);

                if (grpcStatusCode === undefined) {
                    return callback({
                        message: `invalid grpc status code ${e.code}`,
                        code: grpc.status.INTERNAL,
                        details: e.message,
                        metadata: rpcMetaToGrpc(e.meta),
                    });
                }

                return callback({
                    code: grpcStatusCode,
                    details: e.message,
                    metadata: rpcMetaToGrpc(e.meta),
                });
            }

            return callback({
                code: grpc.status.INTERNAL,
                message: e.message,
                name: e.name,
                stack: e.stack
            });
        }

        const grpcStatusCode = rpcCodeToGrpc(context.status.code);

        if (grpcStatusCode === undefined) {
            return callback({
                code: grpc.status.INTERNAL,
                message: `invalid grpc status code ${context.status.code}`,
                details: context.status.detail,
            });
        }

        if (grpcStatusCode !== grpc.status.OK) {
            return callback({
                code: grpcStatusCode,
                details: context.status.detail,
            });
        }

        callback(null, response, rpcMetaToGrpc(context.trailers));
    };
}


function mapServerStreaming<I extends object, O extends object>(methodInfo: MethodInfo, method: ServerStreamingMethod<I, O>): grpc.handleServerStreamingCall<I, O> {
    return async (call: grpc.ServerWritableStream<I, O>) => {

        const deadlineGrpc = call.getDeadline();
        const deadlineDate = typeof deadlineGrpc === 'number' ? new Date(deadlineGrpc) : deadlineGrpc;

        const context: ServerCallContext = {
            method: methodInfo,
            headers: grpcMetaToRpc(call.metadata),
            sendResponseHeaders(data) {
                call.sendMetadata(rpcMetaToGrpc(data));
            },
            status: {
                code: grpc.status[grpc.status.OK],
                detail: ''
            },
            trailers: {},
            deadline: deadlineDate,
        };


        const responseStream: RpcInputStream<O> = {
            send(message: O) {
                return new Promise<void>((resolve, reject) => {
                    call.write(message, resolve);
                });
            },
            complete() {
                return Promise.resolve();
            }
        };

        try {
            await method(call.request, responseStream, context);
        } catch (e) {
            if (e instanceof RpcError) {

                const grpcStatusCode = rpcCodeToGrpc(e.code);

                if (grpcStatusCode === undefined) {
                    let d: any = new Error(`invalid grpc status code ${e.code}`);
                    d.code = grpc.status.INTERNAL; // this is picked up
                    // d.metadata = new grpc.Metadata(); // but this isn't
                    return call.destroy(d);
                }
                return call.destroy(e);
            }

            return call.destroy(e);
        }

        const grpcStatusCode = rpcCodeToGrpc(context.status.code);

        if (grpcStatusCode === undefined) {
            let d: any = new Error(`invalid grpc status code ${context.status.code}`);
            d.code = grpc.status.INTERNAL; // this is picked up
            // d.metadata = new grpc.Metadata(); // but this isn't
            return call.destroy(d);
        }

        if (grpcStatusCode !== grpc.status.OK) {
            let d: any = new Error(context.status.detail);
            d.code = grpcStatusCode; // this is picked up
            // d.metadata = new grpc.Metadata(); // but this isn't
            return call.destroy(d);
        }

        call.end(rpcMetaToGrpc(context.trailers));
    };
}


function rpcCodeToGrpc(from: string): grpc.status | undefined {
    let v = listEnumValues(grpc.status).find(v => v.name === from);
    return v ? v.number : undefined;
}


function rpcMetaToGrpc(from: RpcMetadata, base?: grpc.Metadata): grpc.Metadata {
    const to = base ?? new grpc.Metadata();
    for (let k of Object.keys(from)) {
        let v = from[k];
        if (typeof v == 'string') {
            to.add(k, v);
        } else {
            for (let vv of v) {
                to.add(k, vv);
            }
        }
    }
    return to;
}


function grpcMetaToRpc(from: grpc.Metadata): RpcMetadata {
    const meta: RpcMetadata = {};
    const h2 = from.toHttp2Headers();
    for (let k of Object.keys(h2)) {
        let v = h2[k];
        if (v === undefined) {
            continue;
        }
        if (typeof v === "number") {
            v = v.toString();
        }
        meta[k] = v;
    }
    return meta;
}

