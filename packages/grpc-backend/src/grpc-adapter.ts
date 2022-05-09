import {
    MethodInfo,
    RpcError,
    RpcInputStream,
    RpcMetadata,
    RpcOutputStream,
    RpcOutputStreamController,
    ServerCallContext,
    ServerCallContextController,
    ServiceInfo
} from "@chippercash/protobuf-runtime-rpc";
import * as grpc from "@grpc/grpc-js";
import {assert} from "@chippercash/protobuf-runtime";
import {metadataFromGrpc, metadataToGrpc, rpcCodeToGrpc} from "./util";

type ContextFactory = (
  serviceInfo: ServiceInfo,
  methodInfo: MethodInfo,
  call: grpc.ServerUnaryCall<any, any> | grpc.ServerReadableStream<any, any> | grpc.ServerWritableStream<any, any>,
) => ServerCallContext;

export interface AdaptServiceOptions {
    contextFactory?: ContextFactory;
}

/**
 * Create a grpc service definition and an implementation for @grpc/grpc-js.
 */
export function adaptService(serviceInfo: ServiceInfo, serviceImplementation: any, options: AdaptServiceOptions = {})
  : [grpc.ServiceDefinition, grpc.UntypedServiceImplementation] {
    return [
        createDefinition(serviceInfo),
        mapService(serviceInfo, serviceImplementation, options)
    ];
}


/**
 * Create a service definition for @grpc/grpc-js from service info.
 */
export function createDefinition(serviceInfo: ServiceInfo): grpc.ServiceDefinition {
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
export function mapService(si: ServiceInfo, service: any, options: AdaptServiceOptions): grpc.UntypedServiceImplementation {
    const grpcImp: grpc.UntypedServiceImplementation = {};
    const ctxFactory = options.contextFactory ?? createContext;

    for (let mi of si.methods) {
        assert(typeof service[mi.localName] == "function", `implementation is missing method ${mi.localName}()`);
        const fn = service[mi.localName].bind(service);
        if (mi.serverStreaming && mi.clientStreaming) {
            grpcImp[mi.localName] = mapBidi(si, mi, ctxFactory, fn as BidiMethod<object, object>)
        } else if (mi.serverStreaming) {
            grpcImp[mi.localName] = mapServerStreaming(si, mi, ctxFactory, fn as ServerStreamingMethod<object, object>)
        } else if (mi.clientStreaming) {
            grpcImp[mi.localName] = mapClientStreaming(si, mi, ctxFactory, fn as ClientStreamingMethod<object, object>)
        } else {
            grpcImp[mi.localName] = mapUnary(si, mi, ctxFactory, fn as UnaryMethod<object, object>)
        }
    }
    return grpcImp;
}


export function createContext(serviceInfo: ServiceInfo, methodInfo: MethodInfo, call: grpc.ServerUnaryCall<any, any> | grpc.ServerReadableStream<any, any> | grpc.ServerWritableStream<any, any>): ServerCallContext {
    const deadlineGrpc = call.getDeadline();
    const deadlineDate = typeof deadlineGrpc === 'number' ? new Date(deadlineGrpc) : deadlineGrpc;

    const sendHeaders = (data: RpcMetadata) => call.sendMetadata(metadataToGrpc(data));

    const ctx = new ServerCallContextController(
        methodInfo,
        metadataFromGrpc(call.metadata),
        deadlineDate,
        sendHeaders
    );

    call.on('cancelled', () => ctx.notifyCancelled());

    return ctx;
}


function mapUnary<I extends object, O extends object>(serviceInfo: ServiceInfo, methodInfo: MethodInfo, ctxFactory: ContextFactory,
                                                      method: UnaryMethod<I, O>): grpc.handleUnaryCall<I, O> {
    return async (call: grpc.ServerUnaryCall<I, O>, callback: grpc.sendUnaryData<O>) => {
        const context = ctxFactory(serviceInfo, methodInfo, call);

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
                        metadata: metadataToGrpc(e.meta),
                    });
                }

                return callback({
                    code: grpcStatusCode,
                    details: e.message,
                    metadata: metadataToGrpc(e.meta),
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

        callback(null, response, metadataToGrpc(context.trailers));
    };
}


function mapServerStreaming<I extends object, O extends object>(serviceInfo: ServiceInfo, methodInfo: MethodInfo,
                                                                ctxFactory: ContextFactory, method: ServerStreamingMethod<I, O>): grpc.handleServerStreamingCall<I, O> {
    return async (call: grpc.ServerWritableStream<I, O>) => {

        const context = ctxFactory(serviceInfo, methodInfo, call);

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

        call.end(metadataToGrpc(context.trailers));
    };
}


function mapClientStreaming<I extends object, O extends object>(serviceInfo: ServiceInfo, methodInfo: MethodInfo,
                                                                ctxFactory: ContextFactory, method: ClientStreamingMethod<I, O>): grpc.handleClientStreamingCall<I, O> {
    return async (call: grpc.ServerReadableStream<I, O>, callback: grpc.sendUnaryData<O>) => {

        const context = ctxFactory(serviceInfo, methodInfo, call);

        const requestStream = new RpcOutputStreamController<I>();

        call.on('data', args => {
            assert(methodInfo.I.is(args));
            requestStream.notifyMessage(args);
        });

        call.on('end', () => {
            requestStream.notifyComplete();
        });

        call.on('error', e => {
            requestStream.notifyError(e);
        });


        let response: O;
        try {
            response = await method(requestStream, context);
        } catch (e) {
            if (e instanceof RpcError) {

                const grpcStatusCode = rpcCodeToGrpc(e.code);

                if (grpcStatusCode === undefined) {
                    return callback({
                        message: `invalid grpc status code ${e.code}`,
                        code: grpc.status.INTERNAL,
                        details: e.message,
                        metadata: metadataToGrpc(e.meta),
                    });
                }

                return callback({
                    code: grpcStatusCode,
                    details: e.message,
                    metadata: metadataToGrpc(e.meta),
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

        callback(null, response, metadataToGrpc(context.trailers));
    };
}


function mapBidi<I extends object, O extends object>(serviceInfo: ServiceInfo, methodInfo: MethodInfo,
                                                     ctxFactory: ContextFactory, method: BidiMethod<I, O>): grpc.handleBidiStreamingCall<I, O> {
    return async (call: grpc.ServerDuplexStream<I, O>) => {

        const context = ctxFactory(serviceInfo, methodInfo, call);

        const requestStream = new RpcOutputStreamController<I>();

        call.on('data', args => {
            assert(methodInfo.I.is(args));
            if (!requestStream.closed) {
                requestStream.notifyMessage(args);
            }
        });

        call.on('end', () => {
            if (!requestStream.closed) {
                requestStream.notifyComplete();
            }
        });

        call.on('error', e => {
            if (!requestStream.closed) {
                requestStream.notifyError(e);
            }
        });


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
            await method(requestStream, responseStream, context);
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

        call.end(metadataToGrpc(context.trailers));

    };
}
