import {MethodInfo, RpcMetadata, RpcOutputStreamController, RpcStatus, ServerStreamingCall} from "../src";


describe('ServerStreamingCall', () => {

    const
        methodInfo = "fake" as unknown as MethodInfo,
        requestHeaders = {header: "request"},
        request = {payload: "request"},
        responseHeaders = {header: "response"},
        status = {code: "ok", detail: "..."},
        trailers = {trailers: "response"};

    type I = object;
    type O = { id: string };
    let call: ServerStreamingCall<I, O>;
    let stream: RpcOutputStreamController<O>;

    beforeEach(function () {
        const ctrl = new RpcOutputStreamController<O>();
        setTimeout(() => ctrl.notifyMessage({id: "one"}), 10);
        setTimeout(() => ctrl.notifyMessage({id: "two"}), 20);
        setTimeout(() => ctrl.notifyMessage({id: "three"}), 30);
        setTimeout(() => ctrl.notifyComplete(), 40);
        stream = ctrl;
        call = new ServerStreamingCall<I, O>(
            methodInfo,
            requestHeaders,
            request,
            Promise.resolve(responseHeaders),
            stream,
            new Promise<RpcStatus>(resolve => stream.onComplete(() => resolve(status))),
            new Promise<RpcMetadata>(resolve => stream.onComplete(() => resolve(trailers))),
        );
    });

    it('should provide correct data when getting the values first', async function () {
        expect(call.requestHeaders).toBe(requestHeaders);
        expect(call.request).toBe(request);
        expect(call.responses).toBe(stream);
        const ids = [];
        for await (let x of call.responses) {
            ids.push(x.id);
        }
        expect(ids).toEqual(["one", "two", "three"]);
        expect(await call.status).toBe(status);
        expect(await call.trailers).toBe(trailers);
    });


    it('should provide correct data when getting the values last', async function () {
        expect(call.requestHeaders).toBe(requestHeaders);
        expect(call.request).toBe(request);
        expect(call.responses).toBe(stream);
        expect(await call.status).toBe(status);
        expect(await call.trailers).toBe(trailers);
        const ids = [];
        for await (let x of call.responses) {
            ids.push(x.id);
        }
        expect(ids).toEqual(["one", "two", "three"]);
    });

    it('should provide correct data when finished', async function () {
        const finished = await call;
        expect(finished.requestHeaders).toBe(requestHeaders);
        expect(finished.request).toBe(request);
        expect(stream.closed).toBeTrue();
        expect(finished.status).toBe(status);
        expect(finished.trailers).toBe(trailers);
    });


});
