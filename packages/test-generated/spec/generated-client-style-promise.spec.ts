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


});

