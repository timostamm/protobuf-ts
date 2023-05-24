import {
  RpcError,
  ServerStreamingCall,
  TestTransport,
  UnaryCall,
} from "@protobuf-ts/runtime-rpc";
import { AbortController } from "abort-controller";
import {
  Int32Value as Int32Value_Speed,
  StringValue as StringValue_Speed,
} from "../ts-out/speed/google/protobuf/wrappers";
import {
  Int32Value as Int32Value_Size,
  StringValue as StringValue_Size,
} from "../ts-out/size/google/protobuf/wrappers";
import {
  Int32Value as Int32Value_SpeedBigInt,
  StringValue as StringValue_SpeedBigInt,
} from "../ts-out/speed-bigint/google/protobuf/wrappers";
import {
  Int32Value as Int32Value_SizeBigInt,
  StringValue as StringValue_SizeBigInt,
} from "../ts-out/size-bigint/google/protobuf/wrappers";
import { AllStyleServiceClient as AllStyleServicesClient_Speed } from "../ts-out/speed/service-style-all.client";
import { AllStyleServiceClient as AllStyleServicesClient_Size } from "../ts-out/size/service-style-all.client";
import { AllStyleServiceClient as AllStyleServicesClient_SpeedBigInt } from "../ts-out/speed-bigint/service-style-all.client";
import { AllStyleServiceClient as AllStyleServicesClient_SizeBigInt } from "../ts-out/size-bigint/service-style-all.client";

globalThis.AbortController = AbortController; // AbortController polyfill via https://github.com/mysticatea/abort-controller

const msgs = {
  speed: {
    allStylesServicesClient: AllStyleServicesClient_Speed,
    int32Value: Int32Value_Speed,
    stringValue: StringValue_Speed,
  },
  size: {
    allStylesServicesClient: AllStyleServicesClient_Size,
    int32Value: Int32Value_Size,
    stringValue: StringValue_Size,
  },
  speedBigInt: {
    allStylesServicesClient: AllStyleServicesClient_SpeedBigInt,
    int32Value: Int32Value_SpeedBigInt,
    stringValue: StringValue_SpeedBigInt,
  },
  sizeBigInt: {
    allStylesServicesClient: AllStyleServicesClient_SizeBigInt,
    int32Value: Int32Value_SizeBigInt,
    stringValue: StringValue_SizeBigInt,
  },
};

Object.entries(msgs).forEach(
  ([name, { allStylesServicesClient, stringValue, int32Value }]) => {
    describe("generated client style call " + name, () => {
      describe("unary", function () {
        it("should return unary call", async function () {
          const client = new allStylesServicesClient(new TestTransport());
          const call = client.unary(stringValue.create());
          expect(call).toBeInstanceOf(UnaryCall);
        });

        it("should promise results", async function () {
          const client = new allStylesServicesClient(
            new TestTransport({
              headers: {
                responseHeader: "hello",
              },
              response: int32Value.create({ value: 123 }),
              status: { code: "OK", detail: "all good" },
              trailers: {
                responseTrailer: "hello",
              },
            })
          );
          const call = client.unary(
            stringValue.create({ value: "requesting" })
          );
          expect(await call.request).toEqual({ value: "requesting" });
          expect(await call.headers).toEqual({ responseHeader: "hello" });
          expect(await call.response).toEqual({ value: 123 });
          expect(await call.status).toEqual({ code: "OK", detail: "all good" });
          expect(await call.trailers).toEqual({ responseTrailer: "hello" });
        });

        it("should be awaitable finished call", async function () {
          const client = new allStylesServicesClient(
            new TestTransport({
              headers: {
                responseHeader: "hello",
              },
              response: int32Value.create({ value: 123 }),
              status: { code: "OK", detail: "all good" },
              trailers: {
                responseTrailer: "hello",
              },
            })
          );
          const call = client.unary(
            stringValue.create({ value: "requesting" })
          );
          const finished = await call;
          expect(finished.request).toEqual({ value: "requesting" });
          expect(finished.headers).toEqual({ responseHeader: "hello" });
          expect(finished.response).toEqual({ value: 123 });
          expect(finished.status).toEqual({ code: "OK", detail: "all good" });
          expect(finished.trailers).toEqual({ responseTrailer: "hello" });
        });

        it("should reject finished call on response error", async function () {
          const client = new allStylesServicesClient(
            new TestTransport({
              response: new RpcError("response error", "ERR"),
            })
          );
          const call = client.unary({ value: "abc" });
          await expectAsync(call).toBeRejectedWithError("response error");
        });

        it("should reject finished call on status error", async function () {
          const client = new allStylesServicesClient(
            new TestTransport({
              status: new RpcError("status error", "ERR"),
            })
          );
          const call = client.unary({ value: "abc" });
          await expectAsync(call).toBeRejectedWithError("status error");
        });

        it("should reject finished call on abort", async function () {
          const client = new allStylesServicesClient(
            new TestTransport({
              response: { value: 123 },
            })
          );
          const abort = new AbortController();
          setTimeout(() => {
            abort.abort();
          }, 5);
          const call = client.unary({ value: "abc" }, { abort: abort.signal });
          await expectAsync(call).toBeRejectedWithError("user cancel");
        });

        it("should reject results on abort", async function () {
          const client = new allStylesServicesClient(
            new TestTransport({
              response: { value: 123 },
            })
          );
          const abort = new AbortController();
          setTimeout(() => {
            abort.abort();
          }, 5);
          const call = client.unary({ value: "abc" }, { abort: abort.signal });
          await expectAsync(call.headers).toBeRejectedWithError("user cancel");
          await expectAsync(call.response).toBeRejectedWithError("user cancel");
          await expectAsync(call.status).toBeRejectedWithError("user cancel");
          await expectAsync(call.trailers).toBeRejectedWithError("user cancel");
        });
      });

      describe("server-streaming", function () {
        it("should return server streaming call", async function () {
          const client = new allStylesServicesClient(new TestTransport());
          const call = client.serverStream(stringValue.create());
          expect(call).toBeInstanceOf(ServerStreamingCall);
        });

        it("should stream all response messages", async function () {
          const client = new allStylesServicesClient(
            new TestTransport({
              response: [
                int32Value.create({ value: 1 }),
                int32Value.create({ value: 2 }),
                int32Value.create({ value: 3 }),
              ],
            })
          );
          const call = client.serverStream(stringValue.create());
          const received = [];
          for await (let response of call.responses) {
            received.push(response);
          }
          expect(received.length).toBe(3);
        });

        it("should reject stream on message error", async function () {
          const client = new allStylesServicesClient(
            new TestTransport({
              response: new RpcError("response err"),
            })
          );
          const call = client.serverStream(stringValue.create());
          try {
            for await (let _ of call.responses) {
            }
          } catch (error) {
            expect(error).toBeInstanceOf(RpcError);
            expect(error.message).toBe("response err");
          }
        });

        it("should reject finished call on abort", async function () {
          const client = new allStylesServicesClient(
            new TestTransport({
              response: [{ value: 1 }, { value: 2 }, { value: 3 }],
            })
          );
          const abort = new AbortController();
          setTimeout(() => {
            abort.abort();
          }, 5);
          const call = client.serverStream(
            { value: "abc" },
            { abort: abort.signal }
          );
          await expectAsync(call).toBeRejectedWithError("user cancel");
        });

        it("should reject response stream on abort", async function () {
          const client = new allStylesServicesClient(
            new TestTransport({
              response: [{ value: 1 }, { value: 2 }, { value: 3 }],
            })
          );
          const abort = new AbortController();
          setTimeout(() => {
            abort.abort();
          }, 1);
          const call = client.serverStream(
            { value: "abc" },
            { abort: abort.signal }
          );
          try {
            for await (let _ of call.responses) {
            }
            fail("missing error");
          } catch (e) {
            expect(e.code).toBe("CANCELLED");
          }
        });

        it("should reject results on abort", async function () {
          const client = new allStylesServicesClient(
            new TestTransport({
              response: [{ value: 1 }, { value: 2 }, { value: 3 }],
            })
          );
          const abort = new AbortController();
          setTimeout(() => {
            abort.abort();
          }, 5);
          const call = client.serverStream(
            { value: "abc" },
            { abort: abort.signal }
          );
          await expectAsync(call.headers).toBeRejectedWithError("user cancel");
          await expectAsync(call.status).toBeRejectedWithError("user cancel");
          await expectAsync(call.trailers).toBeRejectedWithError("user cancel");
        });
      });
    });
  }
);
