import {assert} from "@protobuf-ts/runtime";
import {AnnotatedServiceClient} from "../ts-out/service-annotated";
import {RpcTransport} from "@protobuf-ts/runtime-rpc";


describe('spec.AnnotatedService', function () {

    it('Get should have google.api.http option', function () {

        let client = new AnnotatedServiceClient(null as unknown as RpcTransport);
        let mi = client.methods.find(mi => mi.name === "Get");
        assert(mi !== undefined);

        expect(mi.options).toBeDefined();

        if (mi.options) {
            expect(mi.options["google.api.http"]).toBeDefined();
        }
    });

});


