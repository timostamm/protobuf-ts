import {RpcError, ServerStreamingCall, TestTransport, UnaryCall} from "@protobuf-ts/runtime-rpc";
import {AbortController} from "abort-controller";
import {Int32Value, StringValue} from "../gen/google/protobuf/wrappers";
import {AllStyleServiceClient} from "../gen/service-style-all.client";

// Copied from test-default/generated-client-style-call.spec.ts. Do not edit.
globalThis.AbortController = AbortController; // AbortController polyfill via https://github.com/mysticatea/abort-controller


describe('generated client style call', () => {


    describe("unary", function () {

        it('should return unary call', async function () {
            const client = new AllStyleServiceClient(new TestTransport());
            const call = client.unary(StringValue.create());
            expect(call).toBeInstanceOf(UnaryCall);
        });

        it('should promise results', async function () {
            const client = new AllStyleServiceClient(new TestTransport({
                headers: {
                    responseHeader: "hello",
                },
                response: Int32Value.create({value: 123}),
                status: {code: "OK", detail: "all good"},
                trailers: {
                    responseTrailer: "hello",
                },
            }));
            const call = client.unary(StringValue.create({value: "requesting"}));
            expect(await call.request).toEqual({value: "requesting"});
            expect(await call.headers).toEqual({responseHeader: "hello"});
            expect(await call.response).toEqual({value: 123});
            expect(await call.status).toEqual({code: "OK", detail: "all good"});
            expect(await call.trailers).toEqual({responseTrailer: "hello"});
        });

        it('should be awaitable finished call', async function () {
            const client = new AllStyleServiceClient(new TestTransport({
                headers: {
                    responseHeader: "hello",
                },
                response: Int32Value.create({value: 123}),
                status: {code: "OK", detail: "all good"},
                trailers: {
                    responseTrailer: "hello",
                },
            }));
            const call = client.unary(StringValue.create({value: "requesting"}));
            const finished = await call;
            expect(finished.request).toEqual({value: "requesting"});
            expect(finished.headers).toEqual({responseHeader: "hello"});
            expect(finished.response).toEqual({value: 123});
            expect(finished.status).toEqual({code: "OK", detail: "all good"});
            expect(finished.trailers).toEqual({responseTrailer: "hello"});
        });

        it('should reject finished call on response error', async function () {
            const client = new AllStyleServiceClient(new TestTransport({
                response: new RpcError("response error", "ERR"),
            }));
            const call = client.unary({value: "abc"});
            await expectAsync(call).toBeRejectedWithError("response error")
        });

        it('should reject finished call on status error', async function () {
            const client = new AllStyleServiceClient(new TestTransport({
                status: new RpcError("status error", "ERR"),
            }));
            const call = client.unary({value: "abc"});
            await expectAsync(call).toBeRejectedWithError("status error")
        });

        it('should reject finished call on abort', async function () {
            const client = new AllStyleServiceClient(new TestTransport({
                response: {value: 123}
            }));
            const abort = new AbortController();
            setTimeout(() => {
                abort.abort();
            }, 5)
            const call = client.unary({value: "abc"}, {abort: abort.signal});
            await expectAsync(call).toBeRejectedWithError("user cancel")
        });

        it('should reject results on abort', async function () {
            const client = new AllStyleServiceClient(new TestTransport({
                response: {value: 123}
            }));
            const abort = new AbortController();
            setTimeout(() => {
                abort.abort();
            }, 5)
            const call = client.unary({value: "abc"}, {abort: abort.signal});
            await expectAsync(call.headers).toBeRejectedWithError("user cancel")
            await expectAsync(call.response).toBeRejectedWithError("user cancel")
            await expectAsync(call.status).toBeRejectedWithError("user cancel")
            await expectAsync(call.trailers).toBeRejectedWithError("user cancel")
        });

    });


    describe("server-streaming", function () {

        it('should return server streaming call', async function () {
            const client = new AllStyleServiceClient(new TestTransport());
            const call = client.serverStream(StringValue.create());
            expect(call).toBeInstanceOf(ServerStreamingCall);
        });

        it('should stream all response messages', async function () {
            const client = new AllStyleServiceClient(new TestTransport({
                response: [
                    Int32Value.create({value: 1}),
                    Int32Value.create({value: 2}),
                    Int32Value.create({value: 3}),
                ]
            }));
            const call = client.serverStream(StringValue.create());
            const received: Int32Value[] = [];
            for await (let response of call.responses) {
                received.push(response);
            }
            expect(received.length).toBe(3);
        });

        it('should reject stream on message error', async function () {
            const client = new AllStyleServiceClient(new TestTransport({
                response: new RpcError("response err")
            }));
            const call = client.serverStream(StringValue.create());
            try {
                for await (let response of call.responses) {
                }
            } catch (error) {
                expect(error).toBeInstanceOf(RpcError);
                expect(error.message).toBe("response err");
            }
        });

        it('should reject finished call on abort', async function () {
            const client = new AllStyleServiceClient(new TestTransport({
                response: [
                    {value: 1},
                    {value: 2},
                    {value: 3},
                ]
            }));
            const abort = new AbortController();
            setTimeout(() => {
                abort.abort();
            }, 5)
            const call = client.serverStream({value: "abc"}, {abort: abort.signal});
            await expectAsync(call).toBeRejectedWithError("user cancel")
        });

        it('should reject response stream on abort', async function () {
            const client = new AllStyleServiceClient(new TestTransport({
                response: [
                    {value: 1},
                    {value: 2},
                    {value: 3},
                ]
            }));
            const abort = new AbortController();
            setTimeout(() => {
                abort.abort();
            }, 1)
            const call = client.serverStream({value: "abc"}, {abort: abort.signal});
            try {
                for await (let msg of call.responses) {
                }
                fail("missing error");
            } catch (e) {
                expect(e.code).toBe("CANCELLED");
            }
        });

        it('should reject results on abort', async function () {
            const client = new AllStyleServiceClient(new TestTransport({
                response: [
                    {value: 1},
                    {value: 2},
                    {value: 3},
                ]
            }));
            const abort = new AbortController();
            setTimeout(() => {
                abort.abort();
            }, 5)
            const call = client.serverStream({value: "abc"}, {abort: abort.signal});
            await expectAsync(call.headers).toBeRejectedWithError("user cancel")
            await expectAsync(call.status).toBeRejectedWithError("user cancel")
            await expectAsync(call.trailers).toBeRejectedWithError("user cancel")
        });

    });


});

