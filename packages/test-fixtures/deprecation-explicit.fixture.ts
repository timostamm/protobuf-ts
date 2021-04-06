import type {Fixture} from "./index";

const f: Fixture[] = [];
export default f;

f.push({
    typeName: 'spec.DeprecatedMessage',
    deprecated: 'explicit',
    fields: [
        {no: 1, name: "field", kind: "scalar", T: 9 /*string*/},
    ],
});


f.push({
    typeName: 'spec.DeprecatedFieldMessage',
    deprecatedFields: ['deprecated_field'],
    fields: [
        {no: 1, name: "deprecated_field", kind: "scalar", T: 9 /*string*/},
        {no: 2, name: "current_field", kind: "scalar", T: 9 /*string*/},
    ],
});

