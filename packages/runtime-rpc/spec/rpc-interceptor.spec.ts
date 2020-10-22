import {
    ClientStreamingCall,
    Deferred,
    DuplexStreamingCall,
    MethodInfo,
    NextUnaryFn,
    RpcError,
    RpcMetadata,
    RpcOptions,
    RpcStatus,
    RpcTransport,
    ServerStreamingCall,
    ServiceType,
    stackIntercept,
    UnaryCall
} from "../src";
import {IMessageType} from "@protobuf-ts/runtime";


const TestService = new ServiceType("TestService", [
    {name: "test", I: null as unknown as IMessageType<RequestMsg>, O: null as unknown as IMessageType<ResponseMsg>}
]);

interface RequestMsg {
    foo: string;
}

interface ResponseMsg {
    bar: string;
}


describe('stackIntercept("unary")', () => {

    it('should invoke transport unary()', async () => {
        let options: RpcOptions = {
            meta: {
                i_am: "request header"
            },
        };
        let transport = new MockTransport();
        let request: RequestMsg = {
            foo: "hello"
        };
        let call = stackIntercept<RequestMsg, ResponseMsg>("unary", transport, TestService.methods[0], options, request);
        transport.resolveUnary(
            {i_am: "response header"},
            {bar: "world"},
            {code: "OK", detail: ""},
            {i_am: "response trailer"},
        );
        let finished = await call;
        expect(finished.requestHeaders).toEqual({
            i_am: "request header"
        });
        expect(finished.headers).toEqual({
            i_am: "response header"
        });
        expect(finished.response).toEqual({
            bar: "world"
        });
        expect(finished.trailers).toEqual({
            i_am: "response trailer"
        });
    });

    it('should invoked interceptors in order', async () => {
        let calledIc: string[] = [];
        let options: RpcOptions = {
            interceptors: [
                {
                    interceptUnary(next: NextUnaryFn, method: MethodInfo, input: object, options: RpcOptions): UnaryCall {
                        calledIc.push("a");
                        return next(method, input, options);
                    }
                },
                {
                    interceptUnary(next: NextUnaryFn, method: MethodInfo, input: object, options: RpcOptions): UnaryCall {
                        calledIc.push("b");
                        return next(method, input, options);
                    }
                }
            ]
        };
        let transport = new MockTransport();
        let request: RequestMsg = {
            foo: "hello"
        };
        let call = stackIntercept<RequestMsg, ResponseMsg>("unary", transport, TestService.methods[0], options, request);
        transport.resolveUnary({}, {bar: "world"}, {code: "OK", detail: ""}, {});
        await call;
        expect(calledIc).toEqual(["a", "b"]);
    });


});


/**
 * @deprecated switch to TestTransport
 */
class MockTransport implements RpcTransport {

    constructor() {
    }

    mergeOptions(options?: Partial<RpcOptions>): RpcOptions {
        throw new Error("just a stub");
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

