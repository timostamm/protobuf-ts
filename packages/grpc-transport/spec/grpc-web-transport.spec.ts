import {GrpcTransport} from "../src";

describe('GrpcTransport', () => {

    it('can be created', function () {
        let transport = new GrpcTransport({
            baseUrl: "fake",
        });
        expect(transport).toBeDefined();
    });

});
