import {assert} from "@protobuf-ts/runtime";
import {AnnotatedService} from "../gen/service-annotated";
import type {RpcTransport} from "@protobuf-ts/runtime-rpc";
import {readServiceOption} from "@protobuf-ts/runtime-rpc";
import {HttpRule} from "../gen/google/api/http";
import {AnnotatedServiceClient} from "../gen/service-annotated.client";
import {readMethodOption} from "@protobuf-ts/runtime-rpc/";

// Copied from test-default/service-annotated.spec.ts. Do not edit.

describe('readMethodOption', function () {
    it('should read scalar opt', function () {
        let act = readMethodOption(AnnotatedService, "get", "spec.rpc_bar");
        expect(act).toBe('hello');
    });
});

describe('readServiceOption', function () {
    it('should read scalar opt', function () {
        let act = readServiceOption(AnnotatedService, "spec.service_foo");
        expect(act).toBe(true);
    });
});

describe('spec.AnnotatedService', function () {


    describe('example in MANUAL.md', function () {
        it('should work for method option', function () {
            let rule = readMethodOption(AnnotatedService, "get", "google.api.http", HttpRule);
            expect(rule).toBeDefined();
            if (rule) {
                let selector: string = rule.selector;
                let bindings: HttpRule[] = rule.additionalBindings;
                expect(selector).toBeDefined();
                expect(bindings).toBeDefined();
            }
        });
    });


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


