import { assert } from "@protobuf-ts/runtime";
import type { RpcTransport } from "@protobuf-ts/runtime-rpc";
import { readMethodOption, readServiceOption } from "@protobuf-ts/runtime-rpc";
import { AnnotatedService as AnnotatedService_Speed } from "../ts-out/speed/service-annotated";
import { AnnotatedService as AnnotatedService_Size } from "../ts-out/size/service-annotated";
import { AnnotatedService as AnnotatedService_SpeedBigInt } from "../ts-out/speed-bigint/service-annotated";
import { AnnotatedService as AnnotatedService_SizeBigInt } from "../ts-out/size-bigint/service-annotated";
import { HttpRule as HttpRule_Speed } from "../ts-out/speed/google/api/http";
import { HttpRule as HttpRule_Size } from "../ts-out/size/google/api/http";
import { HttpRule as HttpRule_SpeedBigInt } from "../ts-out/speed-bigint/google/api/http";
import { HttpRule as HttpRule_SizeBigInt } from "../ts-out/size-bigint/google/api/http";
import { AnnotatedServiceClient as AnnotatedServiceClient_Speed } from "../ts-out/speed/service-annotated.client";
import { AnnotatedServiceClient as AnnotatedServiceClient_Size } from "../ts-out/size/service-annotated.client";
import { AnnotatedServiceClient as AnnotatedServiceClient_SpeedBigInt } from "../ts-out/speed-bigint/service-annotated.client";
import { AnnotatedServiceClient as AnnotatedServiceClient_SizeBigInt } from "../ts-out/size-bigint/service-annotated.client";

const msgs = {
  speed: {
    annotatedService: AnnotatedService_Speed,
    httpRule: HttpRule_Speed,
    annotatedServiceClient: AnnotatedServiceClient_Speed,
  },
  size: {
    annotatedService: AnnotatedService_Size,
    httpRule: HttpRule_Size,
    annotatedServiceClient: AnnotatedServiceClient_Size,
  },
  speedBigInt: {
    annotatedService: AnnotatedService_SpeedBigInt,
    httpRule: HttpRule_SpeedBigInt,
    annotatedServiceClient: AnnotatedServiceClient_SpeedBigInt,
  },
  sizeBigInt: {
    annotatedService: AnnotatedService_SizeBigInt,
    httpRule: HttpRule_SizeBigInt,
    annotatedServiceClient: AnnotatedServiceClient_SizeBigInt,
  },
};

Object.entries(msgs).forEach(
  ([name, { annotatedService, annotatedServiceClient, httpRule }]) => {
    describe("Service Annotated " + name, () => {
      describe("readMethodOption", function () {
        it("should read scalar opt", function () {
          let act = readMethodOption(annotatedService, "get", "spec.rpc_bar");
          expect(act).toBe("hello");
        });
      });

      describe("readServiceOption", function () {
        it("should read scalar opt", function () {
          let act = readServiceOption(annotatedService, "spec.service_foo");
          expect(act).toBe(true);
        });
      });

      describe("spec.AnnotatedService", function () {
        describe("example in MANUAL.md", function () {
          it("should work for method option", function () {
            let rule = readMethodOption(
              annotatedService,
              "get",
              "google.api.http",
              httpRule
            );
            expect(rule).toBeDefined();
            if (rule) {
              let selector: string = rule.selector;
              let bindings = rule.additionalBindings;
              expect(selector).toBeDefined();
              expect(bindings).toBeDefined();
            }
          });
        });

        describe("ServiceType", function () {
          it('should have "Get" method', function () {
            let mi = annotatedService.methods.find((mi) => mi.name === "Get");
            assert(mi !== undefined);
          });

          it('"Get" method should have "google.api.http" option', function () {
            let mi = annotatedService.methods.find((mi) => mi.name === "Get");
            if (mi !== undefined) {
              expect(mi.options).toBeDefined();
              if (mi.options) {
                expect(mi.options["google.api.http"]).toBeDefined();
                httpRule.fromJson(mi.options["google.api.http"]);
              }
            }
          });

          it('"Get" method option "google.api.http" should be readable using HttpRule', function () {
            let mi = annotatedService.methods.find((mi) => mi.name === "Get");
            if (
              mi !== undefined &&
              mi.options !== undefined &&
              mi.options["google.api.http"] !== undefined
            ) {
              const rule = httpRule.fromJson(mi.options["google.api.http"]);
              expect(rule).toEqual(
                httpRule.create({
                  pattern: {
                    oneofKind: "get",
                    get: "/v1/{name=messages/*}",
                  },
                  additionalBindings: [
                    {
                      pattern: {
                        oneofKind: "get",
                        get: "xxx",
                      },
                    },
                    {
                      pattern: {
                        oneofKind: "get",
                        get: "yyy",
                      },
                    },
                  ],
                })
              );
            }
          });

          it('should have service option "spec.service_foo"', function () {
            expect(annotatedService.options).toBeDefined();
            if (annotatedService.options) {
              expect(annotatedService.options["spec.service_foo"]).toBeTrue();
            }
          });
        });

        describe("client", function () {
          it("should have same typeName as service type", function () {
            let client = new annotatedServiceClient(
              null as unknown as RpcTransport
            );
            expect(client.typeName).toBe(annotatedService.typeName);
          });

          it("should have same methods as service type", function () {
            let client = new annotatedServiceClient(
              null as unknown as RpcTransport
            );
            expect(client.methods).toEqual(annotatedService.methods);
          });

          it("should have same options as service type", function () {
            let client = new annotatedServiceClient(
              null as unknown as RpcTransport
            );
            expect(client.options).toEqual(annotatedService.options);
          });
        });
      });
    });
  }
);
