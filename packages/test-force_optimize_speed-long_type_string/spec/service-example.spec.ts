import {ExampleRequest, ExampleResponse,} from "../gen/service-example";
import {
    ClientStreamingCall,
    Deferred,
    DuplexStreamingCall,
    mergeRpcOptions,
    MethodInfo,
    NextUnaryFn,
    RpcError,
    RpcMetadata,
    RpcOptions,
    RpcStatus,
    RpcTransport,
    ServerStreamingCall,
    UnaryCall
} from "@protobuf-ts/runtime-rpc";
import {ExampleServiceClient, IExampleServiceClient} from "../gen/service-example.client";

// Copied from test-default/service-example.spec.ts. Do not edit.

describe('ExampleServiceClient', function () {

    describe('unary()', function () {


        it('should invoke transport', async () => {
            let transport = new MockTransport({});
            let client: IExampleServiceClient = new ExampleServiceClient(transport);
            let response = ExampleResponse.create({
                answer: "world"
            });
            let call = client.unary(ExampleRequest.create());
            transport.resolveUnary(
                {},
                response,
                {code: "OK", detail: ""},
                {},
            );
            let finished = await call;
            expect(finished.response).toEqual(response);
        });


        it('should return transport response data', async () => {
            let transport = new MockTransport({});
            let client: IExampleServiceClient = new ExampleServiceClient(transport);
            let call = client.unary(ExampleRequest.create());
            transport.resolveUnary(
                {i_am: "response header"},
                ExampleResponse.create(),
                {code: "foo", detail: "bar"},
                {i_am: "response trailer"},
            );
            let {response, headers, trailers, status} = await call;
            expect(response).toBe(response);
            expect(headers).toEqual({
                i_am: "response header"
            });
            expect(trailers).toEqual({
                i_am: "response trailer"
            });
            expect(status).toEqual({
                code: "foo", detail: "bar"
            });
        });


        it('should merge request meta', async () => {
            let transport = new MockTransport({
                meta: {
                    default_req_header: "yes",
                    overridden_header: "no"
                },
            });
            let client: IExampleServiceClient = new ExampleServiceClient(transport);
            let call = client.unary(ExampleRequest.create(), {
                meta: {
                    call_req_header: "yes",
                    overridden_header: "yes"
                },
            });
            transport.resolveUnary(
                {i_am: "response header"},
                ExampleResponse.create(),
                {code: "OK", detail: ""},
                {i_am: "response trailer"},
            );
            let finished = await call;
            expect(finished.requestHeaders).toEqual({
                default_req_header: "yes",
                call_req_header: "yes",
                overridden_header: "yes"
            });
        });


        it('should stack interceptors', async () => {
            let calledIc: string[] = [];
            let transport = new MockTransport({
                interceptors: [
                    {
                        interceptUnary(next: NextUnaryFn, method: MethodInfo, input: object, options: RpcOptions): UnaryCall {
                            calledIc.push("a");
                            return next(method, input, options);
                        }
                    }
                ],
            });
            let client: IExampleServiceClient = new ExampleServiceClient(transport);
            let call = client.unary(ExampleRequest.create(), {
                interceptors: [
                    {
                        interceptUnary(next: NextUnaryFn, method: MethodInfo, input: object, options: RpcOptions): UnaryCall {
                            calledIc.push("b");
                            return next(method, input, options);
                        }
                    }
                ],
            });
            transport.resolveUnary(
                {},
                ExampleResponse.create(),
                {code: "OK", detail: ""},
                {},
            );
            await call;
            expect(calledIc).toEqual(["a", "b"]);
        });

    });


});


class MockTransport implements RpcTransport {

    constructor(private readonly defaults: RpcOptions) {
    }

    mergeOptions(options?: Partial<RpcOptions>): RpcOptions {
        return mergeRpcOptions(this.defaults, options);
    }

    resolveUnary(headers: RpcMetadata, response: any, status: RpcStatus, trailer: RpcMetadata): void {
        this.unaryHeaders.resolvePending(headers);
        this.unaryResponse.resolvePending(response);
        this.unaryStatus.resolvePending(status);
        this.unaryTrailer.resolvePending(trailer);
    }

    readonly unaryHeaders = new Deferred<RpcMetadata>();
    readonly unaryResponse = new Deferred<any>();
    readonly unaryStatus = new Deferred<RpcStatus>();
    readonly unaryTrailer = new Deferred<RpcMetadata>();

    unary<I extends object, O extends object>(method: MethodInfo<I, O>, input: I, options: RpcOptions): UnaryCall<I, O> {
        return new UnaryCall<I, O>(method, options.meta ?? {}, input, this.unaryHeaders.promise, this.unaryResponse.promise, this.unaryStatus.promise, this.unaryTrailer.promise);
    }

    clientStreaming<I extends object, O extends object>(method: MethodInfo<I, O>, options: RpcOptions): ClientStreamingCall<I, O> {
        throw new RpcError("just a stub");
    }

    duplex<I extends object, O extends object>(method: MethodInfo<I, O>, options: RpcOptions): DuplexStreamingCall<I, O> {
        throw new RpcError("just a stub");
    }

    serverStreaming<I extends object, O extends object>(method: MethodInfo<I, O>, input: I, options: RpcOptions): ServerStreamingCall<I, O> {
        throw new RpcError("just a stub");
    }

}
