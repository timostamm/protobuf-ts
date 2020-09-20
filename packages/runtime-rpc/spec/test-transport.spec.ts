import {RpcError, RpcMetadata, RpcStatus, TestTransport} from "../src";
import {MessageType, ScalarType} from "@protobuf-ts/runtime";
import {normalizeMethodInfo} from "../src/reflection-info";


interface RequestMessage {
    request: string
}

interface ResponseMessage {
    response: string
}

const RequestMessage = new MessageType<RequestMessage>("test.RequestMessage", [{
    no: 1, name: "request", kind: "scalar", T: ScalarType.STRING
}]);
const ResponseMessage = new MessageType<ResponseMessage>("test.ResponseMessage", [{
    no: 1, name: "response", kind: "scalar", T: ScalarType.STRING
}]);


describe('TestTransport', () => {


    describe('unary call', function () {

        const methodInfo = normalizeMethodInfo({
            name: "unary",
            I: RequestMessage,
            O: ResponseMessage
        }, {typeName: "test.Service", methods: [], options: {}});


        it('should resolve with mock data', async function () {
            const
                request = RequestMessage.create({request: "request"}),
                requestHeaders: RpcMetadata = {
                    request: "headers"
                },
                responseHeaders = {response: "headers"},
                response = ResponseMessage.create({response: "a"}),
                responseStatus: RpcStatus = {code: "OK", detail: "all good"},
                responseTrailers: RpcMetadata = {response: "trailers"},
                transport = new TestTransport({
                    headers: responseHeaders,
                    status: responseStatus,
                    trailers: responseTrailers,
                    response: response,
                }),
                options = transport.mergeOptions({meta: requestHeaders}),
                call = transport.unary(methodInfo, request, options);
            expect(call.request).toBe(request);
            expect(call.requestHeaders).toEqual(requestHeaders);
            expect(await call.headers).toEqual(responseHeaders);
            expect(await call.response).toEqual(response);
            expect(await call.status).toEqual(responseStatus);
            expect(await call.trailers).toEqual(responseTrailers);
        });

        it('should have default mock data', async function () {
            const
                transport = new TestTransport(),
                call = transport.unary(methodInfo, RequestMessage.create(), transport.mergeOptions());
            expect(call.request).toBeDefined();
            expect(await call.headers).toEqual(TestTransport.defaultHeaders);
            expect(await call.response).toBeDefined();
            expect(await call.status).toEqual(TestTransport.defaultStatus);
            expect(await call.trailers).toEqual(TestTransport.defaultTrailers);
        });

        it('should reject with mock data', async function () {
            const
                transport = new TestTransport({
                    headers: new RpcError("headers"),
                    response: new RpcError("response"),
                    status: new RpcError("status"),
                    trailers: new RpcError("trailers"),
                }),
                call = transport.unary(methodInfo, RequestMessage.create(), transport.mergeOptions());
            expect(await call.headers.catch(e => e.message)).toBe("headers");
            expect(await call.response.catch(e => e.message)).toBe("response");
            expect(await call.status.catch(e => e.message)).toBe("status");
            expect(await call.trailers.catch(e => e.message)).toBe("trailers");
        });

    });


    describe('server-streaming call', function () {

        const methodInfo = normalizeMethodInfo({
            name: "serverStreaming",
            I: RequestMessage,
            O: ResponseMessage,
            serverStreaming: true,
        }, {typeName: "test.Service", methods: [], options: {}});

        it('should resolve with mock data', async function () {
            const
                request = RequestMessage.create({request: "request"}),
                requestHeaders: RpcMetadata = {
                    request: "headers"
                },
                responseHeaders = {response: "headers"},
                response = [
                    ResponseMessage.create({response: "a"}),
                    ResponseMessage.create({response: "b"}),
                    ResponseMessage.create({response: "c"})
                ],
                responseStatus: RpcStatus = {code: "OK", detail: "all good"},
                responseTrailers: RpcMetadata = {response: "trailers"},
                transport = new TestTransport({
                    headers: responseHeaders,
                    status: responseStatus,
                    trailers: responseTrailers,
                    response: response,
                }),
                options = transport.mergeOptions({meta: requestHeaders}),
                call = transport.serverStreaming(methodInfo, request, options);
            expect(call.request).toBe(request);
            expect(call.requestHeaders).toEqual(requestHeaders);
            expect(await call.headers).toEqual(responseHeaders);
            let responseMessageCount = new Promise(resolve => {
                let count = 0;
                call.response.onNext((message, error, done) => {
                    if (message)
                        count++;
                    if (done)
                        resolve(count);
                })
            });
            expect(await responseMessageCount).toBe(3);
            expect(await call.status).toEqual(responseStatus);
            expect(await call.trailers).toEqual(responseTrailers);
        });

        it('should have default mock data', async function () {
            const
                transport = new TestTransport(),
                call = transport.unary(methodInfo, RequestMessage.create(), transport.mergeOptions());
            expect(call.request).toBeDefined();
            expect(await call.headers).toEqual(TestTransport.defaultHeaders);
            expect(await call.response).toBeDefined();
            expect(await call.status).toEqual(TestTransport.defaultStatus);
            expect(await call.trailers).toEqual(TestTransport.defaultTrailers);
        });

        it('should reject with mock data', async function () {
            const
                transport = new TestTransport({
                    headers: new RpcError("headers"),
                    response: new RpcError("response"),
                    status: new RpcError("status"),
                    trailers: new RpcError("trailers"),
                }),
                call = transport.serverStreaming(methodInfo, RequestMessage.create(), transport.mergeOptions());
            expect(await call.headers.catch(e => e.message)).toBe("headers");
            let responseErrorMessage = new Promise(resolve => call.response.onError(reason => resolve(reason.message)));
            expect(await responseErrorMessage).toBe("response");
            expect(await call.status.catch(e => e.message)).toBe("status");
            expect(await call.trailers.catch(e => e.message)).toBe("trailers");
        });

    });


    describe('client streaming call', function () {

        const methodInfo = normalizeMethodInfo({
            name: "clientStream",
            I: RequestMessage,
            O: ResponseMessage,
            clientStreaming: true,
        }, {typeName: "test.Service", methods: [], options: {}});

        it('should resolve with mock data', async function () {
            const
                requestHeaders: RpcMetadata = {
                    request: "headers"
                },
                responseHeaders = {response: "headers"},
                response = ResponseMessage.create({response: "a"}),
                responseStatus: RpcStatus = {code: "OK", detail: "all good"},
                responseTrailers: RpcMetadata = {response: "trailers"},
                transport = new TestTransport({
                    headers: responseHeaders,
                    status: responseStatus,
                    trailers: responseTrailers,
                    response: response,
                }),
                options = transport.mergeOptions({meta: requestHeaders}),
                call = transport.clientStreaming(methodInfo, options);
            expect(call.request).toBeDefined();
            expect(call.requestHeaders).toEqual(requestHeaders);
            expect(await call.headers).toEqual(responseHeaders);
            expect(await call.response).toEqual(response);
            expect(await call.status).toEqual(responseStatus);
            expect(await call.trailers).toEqual(responseTrailers);
        });

        it('should let input stream send and complete', async function () {
            const
                transport = new TestTransport(),
                call = transport.clientStreaming(methodInfo, transport.mergeOptions());
            await call.request.send({request: "a"});
            await call.request.send({request: "b"});
            await call.request.send({request: "c"});
            expect(await call.status).toEqual(TestTransport.defaultStatus);
        });

        it('should reject input stream send if mocked', async function () {
            const
                transport = new TestTransport({
                    inputMessage: new RpcError("input message error")
                }),
                call = transport.clientStreaming(methodInfo, transport.mergeOptions());
            await expectAsync(call.request.send({request: "a"})).toBeRejectedWithError("input message error");
        });

        it('should reject input stream complete if mocked', async function () {
            const
                transport = new TestTransport({
                    inputComplete: new RpcError("input complete error")
                }),
                call = transport.clientStreaming(methodInfo, transport.mergeOptions());
            await call.request.send({request: "a"});
            await expectAsync(call.request.complete()).toBeRejectedWithError("input complete error");
        });

        it('should have default mock data', async function () {
            const
                transport = new TestTransport(),
                call = transport.clientStreaming(methodInfo, transport.mergeOptions());
            expect(call.request).toBeDefined();
            expect(await call.headers).toEqual(TestTransport.defaultHeaders);
            expect(await call.response).toBeDefined();
            expect(await call.status).toEqual(TestTransport.defaultStatus);
            expect(await call.trailers).toEqual(TestTransport.defaultTrailers);
        });

        it('should reject with mock data', async function () {
            const
                transport = new TestTransport({
                    headers: new RpcError("headers"),
                    response: new RpcError("response"),
                    status: new RpcError("status"),
                    trailers: new RpcError("trailers"),
                }),
                call = transport.clientStreaming(methodInfo, transport.mergeOptions());
            expect(await call.headers.catch(e => e.message)).toBe("headers");
            expect(await call.response.catch(e => e.message)).toBe("response");
            expect(await call.status.catch(e => e.message)).toBe("status");
            expect(await call.trailers.catch(e => e.message)).toBe("trailers");
        });

    });

    describe('duplex streaming call', function () {

        const methodInfo = normalizeMethodInfo({
            name: "clientStream",
            I: RequestMessage,
            O: ResponseMessage,
            clientStreaming: true,
            serverStreaming: true,
        }, {typeName: "test.Service", methods: [], options: {}});

        it('should resolve with mock data', async function () {
            const
                requestHeaders: RpcMetadata = {
                    request: "headers"
                },
                responseHeaders = {response: "headers"},
                response = [
                    ResponseMessage.create({response: "a"}),
                    ResponseMessage.create({response: "b"}),
                    ResponseMessage.create({response: "c"})
                ],
                responseStatus: RpcStatus = {code: "OK", detail: "all good"},
                responseTrailers: RpcMetadata = {response: "trailers"},
                transport = new TestTransport({
                    headers: responseHeaders,
                    status: responseStatus,
                    trailers: responseTrailers,
                    response: response,
                }),
                options = transport.mergeOptions({meta: requestHeaders}),
                call = transport.duplex(methodInfo, options);
            expect(call.request).toBeDefined();
            expect(call.requestHeaders).toEqual(requestHeaders);
            expect(await call.headers).toEqual(responseHeaders);
            let responseMessageCount = new Promise(resolve => {
                let count = 0;
                call.response.onNext((message, error, done) => {
                    if (message)
                        count++;
                    if (done)
                        resolve(count);
                })
            });
            expect(await responseMessageCount).toBe(3);
            expect(await call.status).toEqual(responseStatus);
            expect(await call.trailers).toEqual(responseTrailers);
        });

        it('should let input stream send and complete', async function () {
            const
                transport = new TestTransport(),
                call = transport.clientStreaming(methodInfo, transport.mergeOptions());
            await call.request.send({request: "a"});
            await call.request.send({request: "b"});
            await call.request.send({request: "c"});
            expect(await call.status).toEqual(TestTransport.defaultStatus);
        });

        it('should reject input stream send if mocked', async function () {
            const
                transport = new TestTransport({
                    inputMessage: new RpcError("input message error")
                }),
                call = transport.clientStreaming(methodInfo, transport.mergeOptions());
            await expectAsync(call.request.send({request: "a"})).toBeRejectedWithError("input message error");
        });

        it('should reject input stream complete if mocked', async function () {
            const
                transport = new TestTransport({
                    inputComplete: new RpcError("input complete error")
                }),
                call = transport.clientStreaming(methodInfo, transport.mergeOptions());
            await call.request.send({request: "a"});
            await expectAsync(call.request.complete()).toBeRejectedWithError("input complete error");
        });

        it('should have default mock data', async function () {
            const
                transport = new TestTransport(),
                call = transport.duplex(methodInfo, transport.mergeOptions());
            expect(call.request).toBeDefined();
            expect(await call.headers).toEqual(TestTransport.defaultHeaders);
            expect(await call.response).toBeDefined();
            expect(await call.status).toEqual(TestTransport.defaultStatus);
            expect(await call.trailers).toEqual(TestTransport.defaultTrailers);
        });

        it('should reject with mock data', async function () {
            const
                transport = new TestTransport({
                    headers: new RpcError("headers"),
                    response: new RpcError("response"),
                    status: new RpcError("status"),
                    trailers: new RpcError("trailers"),
                }),
                call = transport.duplex(methodInfo, transport.mergeOptions());
            expect(await call.headers.catch(e => e.message)).toBe("headers");
            let responseErrorMessage = new Promise(resolve => call.response.onError(reason => resolve(reason.message)));
            expect(await responseErrorMessage).toBe("response");
            expect(await call.status.catch(e => e.message)).toBe("status");
            expect(await call.trailers.catch(e => e.message)).toBe("trailers");
        });

    });

});
