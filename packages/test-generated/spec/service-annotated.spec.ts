import {assert} from "@protobuf-ts/runtime";
import {AnnotatedService, AnnotatedServiceClient} from "../ts-out/service-annotated";
import {RpcTransport} from "@protobuf-ts/runtime-rpc";
import {HttpRule} from "../ts-out/google/api/http";


describe('spec.AnnotatedService', function () {


    describe('ServiceType', function () {

        it('should have "Get" method', function () {
            let mi = AnnotatedService.methods.find(mi => mi.name === "Get");
            assert(mi !== undefined);
        });

        it('"Get" method should have "google.api.http" option', function () {
            let mi = AnnotatedService.methods.find(mi => mi.name === "Get");
            if (mi !== undefined) {
                expect(mi.options).toBeDefined();
                if (mi.options) {
                    expect(mi.options["google.api.http"]).toBeDefined();
                    HttpRule.fromJson(mi.options["google.api.http"]);
                }
            }
        });

        it('"Get" method option "google.api.http" should be readable using HttpRule', function () {
            let mi = AnnotatedService.methods.find(mi => mi.name === "Get");
            if (mi !== undefined && mi.options !== undefined && mi.options["google.api.http"] !== undefined) {
                const rule = HttpRule.fromJson(mi.options["google.api.http"]);
                expect(rule).toEqual(HttpRule.create({
                    pattern: {
                        oneofKind: "get",
                        get: "/v1/{name=messages/*}"
                    },
                    additionalBindings: [{
                        pattern: {
                            oneofKind: "get",
                            get: "xxx"
                        }
                    }, {
                        pattern: {
                            oneofKind: "get",
                            get: "yyy"
                        }
                    }]
                }));
            }
        });

        it('should have service option "spec.service_foo"', function () {
            expect(AnnotatedService.options).toBeDefined();
            if (AnnotatedService.options) {
                expect(AnnotatedService.options["spec.service_foo"]).toBeTrue();
            }
        });

    });

    describe("client", function () {

        it('should have same typeName as service type', function () {
            let client = new AnnotatedServiceClient(null as unknown as RpcTransport);
            expect(client.typeName).toBe(AnnotatedService.typeName);
        });

        it('should have same methods as service type', function () {
            let client = new AnnotatedServiceClient(null as unknown as RpcTransport);
            expect(client.methods).toEqual(AnnotatedService.methods);
        });

        it('should have same options as service type', function () {
            let client = new AnnotatedServiceClient(null as unknown as RpcTransport);
            expect(client.options).toEqual(AnnotatedService.options);
        });

    });

});


