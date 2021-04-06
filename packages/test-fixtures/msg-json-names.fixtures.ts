import type {Fixture} from "./index";

const f: Fixture[] = [];
export default f;

f.push({
    typeName: 'spec.JsonNamesMessage',
    fields: [
        {no: 1, name: "scalar_field", jsonName: "scalarFieldJsonName", kind: "scalar", T: 9 /*string*/},
        {
            no: 2,
            name: "repeated_scalar_field",
            jsonName: "repeatedScalarFieldJsonName",
            kind: "scalar",
            T: 9 /*string*/,
            repeat: 2 /*UNPACKED*/
        }
    ],
    messages: {
        'default': {
            scalarField: "",
            repeatedScalarField: []
        },
        'example': {
            scalarField: "hello",
            repeatedScalarField: ["hello", "world"]
        },
    },
    json: {
        'default': {},
        'example': {
            'scalarFieldJsonName': "hello",
            'repeatedScalarFieldJsonName': ["hello", "world"]
        },
    },
});

