import {assert} from "@protobuf-ts/runtime";
import {AnnotatedService, AnnotatedServiceClient} from "../ts-out/service-annotated";
import {RpcTransport} from "@protobuf-ts/runtime-rpc";


describe('spec.AnnotatedService', function () {


    describe('ServiceType', function () {

        it('should have "Get" method', function () {
            let mi = AnnotatedService.methods.find(mi => mi.name === "Get");
            assert(mi !== undefined);
            expect(mi.options).toBeDefined();
            if (mi.options) {
                expect(mi.options["google.api.http"]).toBeDefined();
            }
        });

        it('"Get" method should have "google.api.http" option', function () {
            let mi = AnnotatedService.methods.find(mi => mi.name === "Get");
            if (mi !== undefined) {
                expect(mi.options).toBeDefined();
                if (mi.options) {
                    expect(mi.options["google.api.http"]).toBeDefined();
                }
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


