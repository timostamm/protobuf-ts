import {RpcError, TestTransport} from "@protobuf-ts/runtime-rpc";
import {AbortController} from "abort-controller";
import {Int32Value, StringValue} from "../ts-out/google/protobuf/wrappers";
import {PromiseStyleServiceClient} from "../ts-out/service-style-promise";

globalThis.AbortController = AbortController; // AbortController polyfill via https://github.com/mysticatea/abort-controller


describe('generated client style promise', () => {


    describe("server-streaming", function () {

        it('should return async iterable', async function () {
            const client = new PromiseStyleServiceClient(new TestTransport({
                response: [
                    Int32Value.create({value: 1}),
                    Int32Value.create({value: 2}),
                    Int32Value.create({value: 3}),
                ]
            }));
            const received: Int32Value[] = [];
            for await (let response of client.serverStream(StringValue.create())) {
                received.push(response);
            }
            expect(received.length).toBe(3);
        });

        it('should reject iterator on message error', async function () {
            const client = new PromiseStyleServiceClient(new TestTransport({
                response: new RpcError("sorry...")
            }));
            try {
                for await (let response of client.serverStream(StringValue.create())) {
                }
            } catch (error) {
                expect(error).toBeInstanceOf(RpcError);
                expect(error.message).toBe("sorry...");
            }
        });

        it('should reject iterator on status error', async function () {
            const client = new PromiseStyleServiceClient(new TestTransport({
                status: new RpcError("status err"),
                response: [
                    {value: 1},
                    {value: 2},
                    {value: 3},
                ]
            }));
            const msg: Int32Value[] = [];
            try {
                for await (let response of client.serverStream(StringValue.create())) {
                    msg.push(response);
                }
            } catch (error) {
                expect(error).toBeInstanceOf(RpcError);
                expect(msg.length).toBe(3);
                expect(error.message).toBe("status err");
            }
        });

    });


    describe("unary", function () {

        it('should return message promise', async function () {
            const client = new PromiseStyleServiceClient(new TestTransport({
                response: {value: 123}
            }));
            let response = await client.unary({value: "abc"});
            expect(response).toEqual({value: 123});
        });

        it('should reject on response error', async function () {
            const client = new PromiseStyleServiceClient(new TestTransport({
                response: new RpcError("response error", "ERR"),
            }));
            await expectAsync(
                client.unary({value: "abc"})
            ).toBeRejectedWithError("response error")
        });

        it('should reject on status error', async function () {
            const client = new PromiseStyleServiceClient(new TestTransport({
                status: new RpcError("status error", "ERR"),
            }));
            await expectAsync(
                client.unary({value: "abc"})
            ).toBeRejectedWithError("status error")
        });

        it('should cancel if signaled', async function () {
            const client = new PromiseStyleServiceClient(new TestTransport());
            const abort = new AbortController();
            setTimeout(() => {
                abort.abort();
            }, 5)
            const promise = client.unary({value: "abc"}, {
                abort: abort.signal
            });
            await expectAsync(promise).toBeRejectedWithError(RpcError, "user cancel")
        });

        it('should cancel if signal already aborted', async function () {
            const client = new PromiseStyleServiceClient(new TestTransport());
            const abort = new AbortController();
            abort.abort();
            const promise = client.unary({value: "abc"}, {
                abort: abort.signal
            });
            await expectAsync(promise).toBeRejectedWithError(RpcError, "user cancel")
        });

    });


    describe("client-streaming", function () {

        async function* produceInput() {
            yield StringValue.create({value: "a"});
            yield StringValue.create({value: "b"});
            yield StringValue.create({value: "c"});
        }

        it('should return message promise', async function () {
            const client = new PromiseStyleServiceClient(new TestTransport({
                response: {value: 123}
            }));
            let response = await client.clientStream(produceInput());
            expect(response).toEqual({value: 123});
        });

        it('should reject on response error', async function () {
            const client = new PromiseStyleServiceClient(new TestTransport({
                response: new RpcError("response error", "ERR"),
            }));
            await expectAsync(
                client.clientStream(produceInput())
            ).toBeRejectedWithError("response error")
        });

        it('should reject on status error', async function () {
            const client = new PromiseStyleServiceClient(new TestTransport({
                status: new RpcError("status error", "ERR"),
            }));
            await expectAsync(
                client.clientStream(produceInput())
            ).toBeRejectedWithError("status error")
        });

        it('should cancel if signaled', async function () {
            const client = new PromiseStyleServiceClient(new TestTransport());
            const abort = new AbortController();
            setTimeout(() => {
                abort.abort();
            }, 5)
            let inputError: any = undefined;

            async function* produceInput() {
                try {
                    yield StringValue.create({value: "a"});
                    yield StringValue.create({value: "b"});
                    yield StringValue.create({value: "c"});
                } catch (e) {
                    inputError = e;
                }
            }

            const promise = client.clientStream(produceInput(), {
                abort: abort.signal
            });
            await expectAsync(promise).toBeRejectedWithError(RpcError, "user cancel")
            expect(inputError).toBeDefined();
            expect(inputError).toBeInstanceOf(RpcError);
            expect(inputError.message).toBe("user cancel");
        });

        it('should cancel if signal already aborted', async function () {
            const client = new PromiseStyleServiceClient(new TestTransport());
            const abort = new AbortController();
            abort.abort();
            const promise = client.clientStream(produceInput(), {
                abort: abort.signal
            });
            await expectAsync(promise).toBeRejectedWithError(RpcError, "user cancel")
        });

        it('should consume all input', async function () {
            const transport = new TestTransport({
                response: Int32Value.create({value: 123})
            });
            const client = new PromiseStyleServiceClient(transport);

            const call = client.clientStream(produceInput());
            expect(transport.sendComplete).toBeFalse();
            expect(transport.sentMessages.length).toBe(0);

            const response = await call;
            expect(response).toEqual({value: 123});
            expect(transport.sendComplete).toBeTrue();
            expect(transport.sentMessages.length).toBe(3);
        });

    });


    describe("duplex-streaming", function () {

        async function* produceInput() {
            yield StringValue.create({value: "a"});
            yield StringValue.create({value: "b"});
            yield StringValue.create({value: "c"});
        }

        it('should return async iterable', async function () {
            const client = new PromiseStyleServiceClient(new TestTransport({
                response: [
                    Int32Value.create({value: 1}),
                    Int32Value.create({value: 2}),
                    Int32Value.create({value: 3}),
                ]
            }));
            const received: Int32Value[] = [];
            for await (let response of client.bidi(produceInput())) {
                received.push(response);
            }
            expect(received.length).toBe(3);
        });

        it('should reject iterator on message error', async function () {
            const client = new PromiseStyleServiceClient(new TestTransport({
                response: new RpcError("sorry...")
            }));
            try {
                for await (let response of client.bidi(produceInput())) {
                }
            } catch (error) {
                expect(error).toBeInstanceOf(RpcError);
                expect(error.message).toBe("sorry...");
            }
        });

        it('should reject iterator on status error', async function () {
            const client = new PromiseStyleServiceClient(new TestTransport({
                status: new RpcError("status err"),
                response: [
                    {value: 1},
                    {value: 2},
                    {value: 3},
                ]
            }));
            const msg: Int32Value[] = [];
            try {
                for await (let response of client.bidi(produceInput())) {
                    msg.push(response);
                }
            } catch (error) {
                expect(error).toBeInstanceOf(RpcError);
                expect(msg.length).toBe(3);
                expect(error.message).toBe("status err");
            }
        });

        it('should consume all input', async function () {
            const transport = new TestTransport({
                response: Int32Value.create({value: 123})
            });
            const client = new PromiseStyleServiceClient(transport);
            const output = client.bidi(produceInput());
            expect(transport.sendComplete).toBeFalse();
            expect(transport.sentMessages.length).toBe(0);
            for await (let response of output) {
            }
            expect(transport.sendComplete).toBeTrue();
            expect(transport.sentMessages.length).toBe(3);
        });


        it('should cancel if signaled', async function () {
            const client = new PromiseStyleServiceClient(new TestTransport({
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
            let inputError: any = undefined;
            let outputError: any = undefined;

            async function* produceInput() {
                try {
                    yield StringValue.create({value: "a"});
                    await new Promise(resolve => setTimeout(resolve, 5));
                    yield StringValue.create({value: "b"});
                    yield StringValue.create({value: "c"});
                } catch (e) {
                    inputError = e;
                }
            }

            const output = client.bidi(produceInput(), {
                abort: abort.signal
            });

            try {
                for await (let response of output) {
                    await new Promise(resolve => setTimeout(resolve, 5));
                }
            } catch (error) {
                outputError = error;
            }

            expect(outputError).toBeInstanceOf(RpcError);
            expect(outputError?.message).toBe("user cancel");
            expect(inputError).toBeInstanceOf(RpcError);
            expect(inputError?.message).toBe("user cancel");
        });


    });


});

