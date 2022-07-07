import {Deferred, MethodInfo, RpcError, RpcInterceptor, ServiceType, UnaryCall} from "@protobuf-ts/runtime-rpc";
import {GrpcStatusCode, GrpcWebFetchTransport, GrpcWebFrame, GrpcWebOptions} from "../src";
import {IMessageType, MessageType, ScalarType} from "@protobuf-ts/runtime";
import { frame, getResponse, getTrailerFrame, makeWhatWgStream, microTaskDelay } from "./support/utils.spec";

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

function getDataFrame(response: string) {
    return frame(GrpcWebFrame.DATA, ResponseMessage.toBinary({ response }));
}

const originalFetch = globalThis.fetch;
let fetch = jasmine.createSpy('fetch', globalThis.fetch);

describe('GrpcWebFetchTransport', () => {

    describe('mergeOptions()', function () {
        let a: RpcInterceptor = {};
        let b: RpcInterceptor = {};
        let c: RpcInterceptor = {};
        let d: RpcInterceptor = {};
        it('should merge interceptors', function () {
            let transport = new GrpcWebFetchTransport({
                baseUrl: "fake",
                interceptors: [a, b],
            });
            let options = transport.mergeOptions({
                interceptors: [c, d],
            });
            expect(options.interceptors).toEqual([a, b, c, d]);
        });
    });

    describe('makeUrl()', function () {
        function makeUrl(options: GrpcWebOptions, serviceTypeName: string, methodLocalName: string, methodOriginalName: string): string {
            let service = new ServiceType(serviceTypeName, [
                {
                    name: methodOriginalName, localName: methodLocalName, O: null as unknown as IMessageType<any>,
                    I: null as unknown as IMessageType<any>,
                }
            ]);
            let transport = new class X extends GrpcWebFetchTransport {
                public makeUrl(method: MethodInfo, options: GrpcWebOptions): string {
                    return super.makeUrl(method, options);
                }
            }(options);
            return transport.makeUrl(service.methods[0], options);
        }

        it('should use the methods original name', function () {
            let url = makeUrl({baseUrl: "http://localhost/prefix"}, "MyService", "localName", "original_name");
            expect(url).toBe("http://localhost/prefix/MyService/original_name");
        });

        it('should use the package name', function () {
            let url = makeUrl({baseUrl: "http://localhost/prefix"}, "package.MyService", "localName", "original_name");
            expect(url).toBe("http://localhost/prefix/package.MyService/original_name");
        });

        it('should drop trailing slash', function () {
            let url = makeUrl({baseUrl: "http://localhost/prefix/"}, "MyService", "localName", "original_name");
            expect(url).toBe("http://localhost/prefix/MyService/original_name");
        });

    });

    describe('clientStreaming()', function () {
        it('throws because it is not supported in grpc-web', async () => {
            const transport = new GrpcWebFetchTransport({ baseUrl: '' });
            const methodInfo: MethodInfo<RequestMessage, ResponseMessage> = {
                service: {
                    typeName: "test.Service",
                    methods: [],
                    options: {},
                },
                name: "clientStreaming",
                I: RequestMessage,
                O: ResponseMessage,
                localName: "clientStreaming",
                idempotency: undefined,
                clientStreaming: true,
                serverStreaming: false,
                options: {},
            };
            try {
                await transport.clientStreaming(methodInfo);
                fail('this should not be implemented');
            } catch (e) {
                expect(e).toBeInstanceOf(RpcError);
                expect(e.code).toBe(GrpcStatusCode[GrpcStatusCode.UNIMPLEMENTED])
            }
        });
    });

    describe('duplex()', function () {
        it('throws because it is not supported in grpc-web', async () => {
            const transport = new GrpcWebFetchTransport({ baseUrl: '' });
            const methodInfo: MethodInfo<RequestMessage, ResponseMessage> = {
                service: {
                    typeName: "test.Service",
                    methods: [],
                    options: {},
                },
                name: "duplex",
                I: RequestMessage,
                O: ResponseMessage,
                localName: "duplex",
                idempotency: undefined,
                clientStreaming: true,
                serverStreaming: true,
                options: {},
            };
            try {
                await transport.duplex(methodInfo);
                fail('this should not be implemented');
            } catch (e) {
                expect(e).toBeInstanceOf(RpcError);
                expect(e.code).toBe(GrpcStatusCode[GrpcStatusCode.UNIMPLEMENTED])
            }
        });
    });

    describe('unary()', () => {
        const base = { baseUrl: 'http://localhost' };
        const callOptions = { ...base, format: 'binary' };
        const callInput = { request: 'unary' };
        const methodInfo: MethodInfo<RequestMessage, ResponseMessage> = {
            service: {
                typeName: "test.Service",
                methods: [],
                options: {},
            },
            name: "unary",
            I: RequestMessage,
            O: ResponseMessage,
            localName: "unary",
            idempotency: undefined,
            clientStreaming: false,
            serverStreaming: false,
            options: {},
        };
        const transport = new GrpcWebFetchTransport(base);
        const getNextCall = (opts: ResponseInit & { body?: BodyInit | null } = {}) => {
            const { next, body } = makeWhatWgStream();
            const res = getResponse({ body, ...opts });
            fetch.and.resolveTo(res);
            const call = transport.unary(methodInfo, callInput, callOptions);
            return { next, call };
        };

        beforeAll(() => {
            globalThis.fetch = fetch;
        });

        afterAll(() => {
            globalThis.fetch = originalFetch;
        });

        beforeEach(() => {
            fetch = jasmine.createSpy('fetch', originalFetch);
            globalThis.fetch = fetch;
        });

        it('handles a successful response', async () => {
            const { next, body } = makeWhatWgStream();
            const res = getResponse({ body });
            const ret = new Deferred<typeof res>(true);
            fetch.and.returnValue(ret.promise);
            const call = transport.unary(methodInfo, callInput, callOptions);

            // Attach promise handlers
            const spy = {
                headers: jasmine.createSpy('call.headers'),
                response: jasmine.createSpy('call.response'),
                status: jasmine.createSpy('call.status'),
                trailers: jasmine.createSpy('call.trailers'),
            };

            for (let k in spy) {
                // @ts-ignore
                call[k].then(spy[k]);
            }

            const callPromiseSpy = jasmine.createSpy('call.then');
            call.then(callPromiseSpy);

            // Fetch called with expected parameters
            expect(fetch).toHaveBeenCalledTimes(1);
            const req = new globalThis.Request(...fetch.calls.mostRecent().args);
            expect(req.url).toBe('http://localhost/test.Service/unary');
            expect(req.method).toBe('POST');
            expect(req.headers.get('Content-Type')).toMatch(/^application\/grpc-web(\-text)?(\+proto)?$/i);
            expect(req.headers.get('X-Grpc-Web')).toBe('1');

            // Nothing resolved yet
            expect(spy.headers).not.toHaveBeenCalled();
            expect(spy.response).not.toHaveBeenCalled();
            expect(spy.status).not.toHaveBeenCalled();
            expect(spy.trailers).not.toHaveBeenCalled();
            expect(callPromiseSpy).not.toHaveBeenCalled();

            // Got HTTP headers and status
            ret.resolve(res);
            await microTaskDelay(ret.promise);

            // Only headers resolved
            expect(spy.headers).toHaveBeenCalledTimes(1);
            expect(spy.headers).toHaveBeenCalledWith({ some: 'header' });
            expect(spy.response).not.toHaveBeenCalled();
            expect(spy.status).not.toHaveBeenCalled();
            expect(spy.trailers).not.toHaveBeenCalled();
            expect(callPromiseSpy).not.toHaveBeenCalled();

            // Partial body with RPC message
            await microTaskDelay(next(getDataFrame('response')));

            // Still only headers resolved even though we have a full data frame parsed to a message
            expect(spy.headers).toHaveBeenCalledTimes(1);
            expect(spy.response).not.toHaveBeenCalled();
            expect(spy.status).not.toHaveBeenCalled();
            expect(spy.trailers).not.toHaveBeenCalled();
            expect(callPromiseSpy).not.toHaveBeenCalled();

            // Tailers with OK status, stream finished
            await microTaskDelay(next(getTrailerFrame(GrpcStatusCode.OK), true));

            // Everything resolved
            expect(spy.headers).toHaveBeenCalledTimes(1);
            expect(spy.response).toHaveBeenCalledTimes(1);
            expect(spy.response).toHaveBeenCalledWith({ response: 'response' });
            expect(spy.status).toHaveBeenCalledTimes(1);
            expect(spy.status).toHaveBeenCalledWith({
                code: GrpcStatusCode[GrpcStatusCode.OK],
                detail: GrpcStatusCode[GrpcStatusCode.OK]
            });
            expect(spy.trailers).toHaveBeenCalledTimes(1);
            expect(spy.trailers).toHaveBeenCalledWith({});
            await expectAsync(call).toBeResolved();
            expect(callPromiseSpy).toHaveBeenCalledTimes(1);
        });

        it('throws for a non-OK HTTP status response', async () => {
            const { next, call } = getNextCall({
                status: 400,
                statusText: 'client error',
            });
            try {
                await call;
                fail('should fail');
            } catch (e) {
                expect(e).toBeInstanceOf(RpcError);
                expect(e.message).toBe('client error');
                expect(e.code).toBe(GrpcStatusCode[GrpcStatusCode.INVALID_ARGUMENT]);
                expect(e.meta).toEqual({ some: 'header' });
            }
        });

        it('throws for a non-OK gRPC status response', async () => {
            const { next, call } = getNextCall();
            await next(getDataFrame('response'));
            await next(getTrailerFrame(GrpcStatusCode.FAILED_PRECONDITION, 'Precondition failed'), true);
            try {
                await call;
                fail('should fail');
            } catch (e) {
                expect(e).toBeInstanceOf(RpcError);
                expect(e.message).toBe('Precondition failed');
                expect(e.code).toBe(GrpcStatusCode[GrpcStatusCode.FAILED_PRECONDITION]);
                expect(e.meta).toEqual({});
            }
        });

        it('throws `INTERNAL` if no HTTP response body', async () => {
            const { next, call } = getNextCall({
                status: 201,
                statusText: 'created',
                body: null,
            });
            try {
                await call;
                fail('should fail');
            } catch (e) {
                expect(e).toBeInstanceOf(RpcError);
                expect(e.code).toBe(GrpcStatusCode[GrpcStatusCode.INTERNAL]);
            }
        });

        it('throws `INTERNAL` if empty response body and no status in headers', async () => {
            const { next, call } = getNextCall();
            await next([], true);
            try {
                await call;
                fail('should fail');
            } catch (e) {
                expect(e).toBeInstanceOf(RpcError);
                expect(e.code).toBe(GrpcStatusCode[GrpcStatusCode.INTERNAL]);
            }
        });

        it('throws `DATA_LOSS` if empty response body and OK status in headers', async () => {
            const { next, call } = getNextCall({
                status: 200,
                statusText: 'success',
                headers: new globalThis.Headers({
                    'some': 'header',
                    'content-type': 'application/grpc-web+proto',
                    'grpc-status': '0',
                }),
            });
            await next([], true);
            try {
                await call;
                fail('should fail');
            } catch (e) {
                expect(e).toBeInstanceOf(RpcError);
                expect(e.code).toBe(GrpcStatusCode[GrpcStatusCode.DATA_LOSS]);
            }
        });

        it('throws `DATA_LOSS` if it does not get a trailer with response', async () => {
            const { next, call } = getNextCall();
            await next(getDataFrame('response'), true);
            try {
                await call;
                fail('should fail');
            } catch (e) {
                expect(e).toBeInstanceOf(RpcError);
                expect(e.code).toBe(GrpcStatusCode[GrpcStatusCode.DATA_LOSS]);
            }
        });

        it('throws `DATA_LOSS` if it gets more than one data frame', async () => {
            const { next, call } = getNextCall();
            await next(getDataFrame('response 1'));
            await next(getDataFrame('response 2'), true);
            try {
                await call;
                fail('should fail');
            } catch (e) {
                expect(e).toBeInstanceOf(RpcError);
                expect(e.code).toBe(GrpcStatusCode[GrpcStatusCode.DATA_LOSS]);
            }
        });

        it('throws if it gets less than one data frame and an error status', async () => {
            const { next, call } = getNextCall();
            await next(getTrailerFrame(GrpcStatusCode.RESOURCE_EXHAUSTED, 'exhaused'), true);
            try {
                await call;
                fail('should fail');
            } catch (e) {
                expect(e).toBeInstanceOf(RpcError);
                expect(e.code).toBe(GrpcStatusCode[GrpcStatusCode.RESOURCE_EXHAUSTED]);
            }
        });

        it('throws `DATA_LOSS` if it gets an `OK` status without a message', async () => {
            const { next, call } = getNextCall();
            await next(getTrailerFrame(GrpcStatusCode.OK), true);
            try {
                await call;
                fail('should fail');
            } catch (e) {
                expect(e).toBeInstanceOf(RpcError);
                expect(e.code).toBe(GrpcStatusCode[GrpcStatusCode.DATA_LOSS]);
            }
        });

        it('throws `CANCELLED` if fetch is aborted', async () => {
            const abortError = new globalThis.DOMException('Request aborted', 'AbortError');
            fetch.and.rejectWith(abortError);
            const call = transport.unary(methodInfo, callInput, callOptions);
            try {
                await call;
                fail('should fail');
            } catch (e) {
                expect(e).toBeInstanceOf(RpcError);
                expect(e.code).toBe(GrpcStatusCode[GrpcStatusCode.CANCELLED]);
            }
        });

        it('throws `INTERNAL` for any other reason', async () => {
            // Error instance
            fetch.and.rejectWith(new Error('error'));
            const call1 = transport.unary(methodInfo, callInput, callOptions);
            try {
                await call1;
                fail('should fail');
            } catch (e) {
                expect(e).toBeInstanceOf(RpcError);
                expect(e.code).toBe(GrpcStatusCode[GrpcStatusCode.INTERNAL]);
            }

            // non-Error instance
            fetch.and.rejectWith('string');
            const call2 = transport.unary(methodInfo, callInput, callOptions);
            try {
                await call2;
                fail('should fail');
            } catch (e) {
                expect(e).toBeInstanceOf(RpcError);
                expect(e.code).toBe(GrpcStatusCode[GrpcStatusCode.INTERNAL]);
            }
        });

    });

    describe('serverStreaming()', () => {
        const base = { baseUrl: 'http://localhost' };
        const callOptions = { ...base, format: 'binary' };
        const callInput: RequestMessage = { request: 'serverStreaming' };
        const methodInfo: MethodInfo<RequestMessage, ResponseMessage> = {
            service: {
                typeName: "test.Service",
                methods: [],
                options: {},
            },
            name: "serverStreaming",
            I: RequestMessage,
            O: ResponseMessage,
            localName: "serverStreaming",
            idempotency: undefined,
            clientStreaming: false,
            serverStreaming: true,
            options: {},
        };
        const transport = new GrpcWebFetchTransport(base);
        const getNextCall = (opts: ResponseInit & { body?: BodyInit | null } = {}) => {
            const { next, body } = makeWhatWgStream();
            const res = getResponse({ body, ...opts });
            fetch.and.resolveTo(res);
            const call = transport.serverStreaming(methodInfo, callInput, callOptions);
            return { next, call };
        };

        beforeAll(() => {
            globalThis.fetch = fetch;
        });

        afterAll(() => {
            globalThis.fetch = originalFetch;
        });

        beforeEach(() => {
            fetch = jasmine.createSpy('fetch', originalFetch);
            globalThis.fetch = fetch;
        });

        it('handles a successful serverStreaming call', async () => {
            const { next, body } = makeWhatWgStream();
            const res = getResponse({ body });
            const ret = new Deferred<typeof res>(true);
            fetch.and.returnValue(ret.promise);
            const call = transport.serverStreaming(methodInfo, callInput, callOptions);

            const responseIterator = call.responses[Symbol.asyncIterator]();

            // Attach promise handlers
            const spy = {
                headers: jasmine.createSpy('call.headers'),
                status: jasmine.createSpy('call.status'),
                trailers: jasmine.createSpy('call.trailers'),
            };

            for (let k in spy) {
                // @ts-ignore
                call[k].then(spy[k]);
            }

            const responsesIteratorSpy = jasmine.createSpy<(res: IteratorResult<ResponseMessage>) => void>('call.responses.iterator');

            let nextIteratorResult = responseIterator.next().then(function chunkThen(res) {
                responsesIteratorSpy(res);
                nextIteratorResult = responseIterator.next().then(chunkThen);
                return res;
            });

            const callPromiseSpy = jasmine.createSpy('call.then');
            call.then(callPromiseSpy);

            // Fetch called with expected parameters
            expect(fetch).toHaveBeenCalledTimes(1);
            const req = new globalThis.Request(...fetch.calls.mostRecent().args);
            expect(req.url).toBe('http://localhost/test.Service/serverStreaming');
            expect(req.method).toBe('POST');
            expect(req.headers.get('Content-Type')).toMatch(/^application\/grpc-web(\-text)?(\+proto)?$/i);
            expect(req.headers.get('X-Grpc-Web')).toBe('1');

            // Nothing resolved yet
            expect(spy.headers).not.toHaveBeenCalled();
            expect(responsesIteratorSpy).not.toHaveBeenCalled();
            expect(spy.status).not.toHaveBeenCalled();
            expect(spy.trailers).not.toHaveBeenCalled();
            expect(callPromiseSpy).not.toHaveBeenCalled();

            // Got HTTP headers and status
            ret.resolve(res);
            await microTaskDelay(ret.promise);

            // Only headers resolved
            expect(spy.headers).toHaveBeenCalledTimes(1);
            expect(spy.headers).toHaveBeenCalledWith({ some: 'header' });
            expect(responsesIteratorSpy).not.toHaveBeenCalled();
            expect(spy.status).not.toHaveBeenCalled();
            expect(spy.trailers).not.toHaveBeenCalled();
            expect(callPromiseSpy).not.toHaveBeenCalled();

            // Partial body with first RPC message
            await microTaskDelay(next(getDataFrame('response 1')));

            // Resolved headers and RPC message
            expect(spy.headers).toHaveBeenCalledTimes(1);
            expect(responsesIteratorSpy).toHaveBeenCalledTimes(1);
            expect(responsesIteratorSpy.calls.mostRecent().args).toEqual([
                { value: { response: 'response 1' }, done: false }
            ]);
            expect(spy.status).not.toHaveBeenCalled();
            expect(spy.trailers).not.toHaveBeenCalled();
            expect(callPromiseSpy).not.toHaveBeenCalled();

            // Partial body with second RPC message
            await microTaskDelay(next(getDataFrame('response 2')));

            // Resolved headers and RPC message
            expect(spy.headers).toHaveBeenCalledTimes(1);
            expect(responsesIteratorSpy).toHaveBeenCalledTimes(2);
            expect(responsesIteratorSpy.calls.mostRecent().args).toEqual([
                { value: { response: 'response 2' }, done: false }
            ]);
            expect(spy.status).not.toHaveBeenCalled();
            expect(spy.trailers).not.toHaveBeenCalled();
            expect(callPromiseSpy).not.toHaveBeenCalled();

            // Tailers with OK status, stream finished
            await microTaskDelay(next(getTrailerFrame(GrpcStatusCode.OK), true));

            // Everything resolved
            expect(spy.headers).toHaveBeenCalledTimes(1);
            expect(responsesIteratorSpy).toHaveBeenCalledTimes(3);
            expect(responsesIteratorSpy.calls.mostRecent().args).toEqual([
                { value: null, done: true }
            ]);
            expect(spy.status).toHaveBeenCalledTimes(1);
            expect(spy.status).toHaveBeenCalledWith({
                code: GrpcStatusCode[GrpcStatusCode.OK],
                detail: GrpcStatusCode[GrpcStatusCode.OK]
            });
            expect(spy.trailers).toHaveBeenCalledTimes(1);
            expect(spy.trailers).toHaveBeenCalledWith({});
            await expectAsync(call).toBeResolved();
            expect(callPromiseSpy).toHaveBeenCalledTimes(1);
        });

        it('throws for a non-OK HTTP status response', async () => {
            const { next, call } = getNextCall({
                status: 400,
                statusText: 'client error',
            });
            try {
                await call;
                fail('should fail');
            } catch (e) {
                expect(e).toBeInstanceOf(RpcError);
                expect(e.message).toBe('client error');
                expect(e.code).toBe(GrpcStatusCode[GrpcStatusCode.INVALID_ARGUMENT]);
                expect(e.meta).toEqual({ some: 'header' });
            }
        });

        it('throws for a non-OK gRPC status response', async () => {
            const { next, call } = getNextCall();
            await next(getDataFrame('response'));
            await next(getTrailerFrame(GrpcStatusCode.FAILED_PRECONDITION, 'Precondition failed'), true);
            try {
                await call;
                fail('should fail');
            } catch (e) {
                expect(e).toBeInstanceOf(RpcError);
                expect(e.message).toBe('Precondition failed');
                expect(e.code).toBe(GrpcStatusCode[GrpcStatusCode.FAILED_PRECONDITION]);
                expect(e.meta).toEqual({});
            }
        });

        it('throws `INTERNAL` if no HTTP response body', async () => {
            const { next, call } = getNextCall({
                status: 201,
                statusText: 'created',
                body: null,
            });
            try {
                await call;
                fail('should fail');
            } catch (e) {
                expect(e).toBeInstanceOf(RpcError);
                expect(e.code).toBe(GrpcStatusCode[GrpcStatusCode.INTERNAL]);
            }
        });

        it('throws `INTERNAL` if empty response body and no status in headers', async () => {
            const { next, call } = getNextCall();
            await next([], true);
            try {
                await call;
                fail('should fail');
            } catch (e) {
                expect(e).toBeInstanceOf(RpcError);
                expect(e.code).toBe(GrpcStatusCode[GrpcStatusCode.INTERNAL]);
            }
        });

        it('success if empty response body and OK status in headers', async () => {
            const { next, call } = getNextCall({
                status: 200,
                statusText: 'success',
                headers: new globalThis.Headers({
                    'some': 'header',
                    'content-type': 'application/grpc-web+proto',
                    'grpc-status': '0',
                }),
            });
            await next([], true);
            const streamResult = await call;
            expect(streamResult.status.code).toBe('OK');
            expect(streamResult.headers).toEqual({ some: 'header' });
        });

        it('throws `DATA_LOSS` if it does not get a trailer with response', async () => {
            const { next, call } = getNextCall();
            await next(getDataFrame('response'), true);
            try {
                await call;
                fail('should fail');
            } catch (e) {
                expect(e).toBeInstanceOf(RpcError);
                expect(e.code).toBe(GrpcStatusCode[GrpcStatusCode.DATA_LOSS]);
            }
        });

        it('throws if it gets less than one data frame and an error status', async () => {
            const { next, call } = getNextCall();
            await next(getTrailerFrame(GrpcStatusCode.RESOURCE_EXHAUSTED, 'exhaused'), true);
            try {
                await call;
                fail('should fail');
            } catch (e) {
                expect(e).toBeInstanceOf(RpcError);
                expect(e.code).toBe(GrpcStatusCode[GrpcStatusCode.RESOURCE_EXHAUSTED]);
            }
        });

        it('throws `CANCELLED` if fetch is aborted', async () => {
            const abortError = new globalThis.DOMException('Request aborted', 'AbortError');
            fetch.and.rejectWith(abortError);
            const call = transport.serverStreaming(methodInfo, callInput, callOptions);
            try {
                await call;
                fail('should fail');
            } catch (e) {
                expect(e).toBeInstanceOf(RpcError);
                expect(e.code).toBe(GrpcStatusCode[GrpcStatusCode.CANCELLED]);
            }
        });

        it('throws `INTERNAL` for any other reason', async () => {
            const someError = new Error('something else');
            fetch.and.rejectWith(someError);
            const call1 = transport.serverStreaming(methodInfo, callInput, callOptions);
            try {
                await call1;
                for await (let chunk of call1.responses) {}
                fail('should fail');
            } catch (e) {
                expect(e).toBeInstanceOf(RpcError);
                expect(e.message).toBe('something else');
                expect(e.code).toBe(GrpcStatusCode[GrpcStatusCode.INTERNAL]);
            }

            // non-Error instance
            fetch.and.rejectWith('something else');
            const call2 = transport.serverStreaming(methodInfo, callInput, callOptions);
            try {
                await call2;
                for await (let chunk of call2.responses) {}
                fail('should fail');
            } catch (e) {
                expect(e).toBeInstanceOf(RpcError);
                expect(e.message).toBe('something else');
                expect(e.code).toBe(GrpcStatusCode[GrpcStatusCode.INTERNAL]);
            }
        });

    });


});
