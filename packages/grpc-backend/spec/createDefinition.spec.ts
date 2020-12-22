import {createDefinition} from "../src/grpc-adapter";

describe('createDefinition()', () => {

    it('works without methods', function () {
        const def = createDefinition({
            typeName: "foo",
            options: {},
            methods: []
        })
        expect(def).toBeDefined();
    });

});
