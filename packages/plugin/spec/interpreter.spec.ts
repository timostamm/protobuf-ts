import {getFileDescriptorSet} from "./support/helpers";
import * as rt from "@protobuf-ts/runtime";
import {Interpreter} from "../src/interpreter";
import {createFileRegistry} from "@bufbuild/protobuf";


describe('interpreter', function () {
    it('recognizes field option jstype', function () {
        [rt.LongType.NUMBER, rt.LongType.STRING, rt.LongType.BIGINT].forEach(normalLongType => {
            const interpreter = new Interpreter(
                createFileRegistry(getFileDescriptorSet()),
                {
                    normalLongType,
                    synthesizeEnumZeroValue: 'UNSPECIFIED$',
                    oneofKindDiscriminator: 'oneofKind',
                    forceExcludeAllOptions: false,
                    keepEnumPrefix: false,
                    useProtoFieldName: false,
                },
            )
            const messageType = interpreter.getMessageType('spec.LongsMessage');

            expectFieldType(messageType, 'sfixed64_field_min', normalLongType);
            expectFieldType(messageType, 'fixed64_field_min_num', rt.LongType.NUMBER);
            expectFieldType(messageType, 'fixed64_field_min_str', rt.LongType.STRING);
            expectFieldType(messageType, 'fixed64_field_min', rt.LongType.BIGINT);
        });
    });
});

// Expect to find a scalar field `name` of type `type`.
function expectFieldType(messageType: rt.IMessageType<rt.UnknownMessage>, name: string, type: rt.LongType) {
    const field = messageType.fields.find(f => f.name === name);
    expect(field).toBeDefined();
    expect(field!.kind).toBe("scalar");
    if (field && field.kind === "scalar") {
        expect(field.L ?? rt.LongType.STRING).toBe(type);
    }
}
