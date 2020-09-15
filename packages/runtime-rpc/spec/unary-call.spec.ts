import {MethodInfo, UnaryCall} from "../src";


describe('UnaryCall', () => {

    const
        methodInfo = "fake" as unknown as MethodInfo,
        requestHeaders = {header: "request"},
        request = {payload: "request"},
        responseHeaders = {header: "response"},
        response = {payload: "request"},
        status = {code: "ok", detail: "..."},
        trailers = {trailers: "response"};

    let call: UnaryCall;

    beforeEach(function () {
        call = new UnaryCall(
            methodInfo,
            requestHeaders,
            request,
            Promise.resolve(responseHeaders),
            Promise.resolve(response),
            Promise.resolve(status),
            Promise.resolve(trailers),
        );
    });

    it('should provide correct data', async function () {
        expect(call.requestHeaders).toBe(requestHeaders);
        expect(call.request).toBe(request);
        expect(await call.response).toBe(response);
        expect(await call.status).toBe(status);
        expect(await call.trailers).toBe(trailers);
    });

    it('should provide correct data when awaiting in wrong order', async function () {
        expect(await call.trailers).toBe(trailers);
        expect(await call.status).toBe(status);
        expect(await call.response).toBe(response);
    });

    it('should provide correct data when finished', async function () {
        const finished = await call;
        expect(finished.requestHeaders).toBe(requestHeaders);
        expect(finished.request).toBe(request);
        expect(finished.response).toBe(response);
        expect(finished.status).toBe(status);
        expect(finished.trailers).toBe(trailers);
    });

});
