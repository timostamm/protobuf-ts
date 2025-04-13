import {IMessageType, MessageType, base64encode} from "@protobuf-ts/runtime";
import {EnumFieldMessage} from "../gen/msg-enum";
import {JsonNamesMessage} from "../gen/msg-json-names";
import {MessageFieldMessage} from "../gen/msg-message";
import {OneofMessageMemberMessage, OneofScalarMemberMessage} from "../gen/msg-oneofs";
import {Proto2OptionalsMessage} from "../gen/msg-proto2-optionals";
import {Proto3OptionalsMessage} from "../gen/msg-proto3-optionals";
import {RepeatedScalarValuesMessage, ScalarValuesMessage} from "../gen/msg-scalar";
import {TestAllTypesProto3} from "../gen/google/protobuf/test_messages_proto3";

// Copied from test-default/generated-binary-read-compat.spec.ts. Do not edit.
let generatedRegistry: IMessageType<any>[] = [
    EnumFieldMessage,
    JsonNamesMessage,
    MessageFieldMessage,
    OneofScalarMemberMessage,
    OneofMessageMemberMessage,
    Proto2OptionalsMessage,
    Proto3OptionalsMessage,
    ScalarValuesMessage,
    RepeatedScalarValuesMessage,
];


describe('generated code compatibility', () => {

    beforeEach(function () {
        jasmine.addCustomEqualityTester((a, b) =>
            (a instanceof Uint8Array && b instanceof Uint8Array) ? a.byteLength === b.byteLength : undefined
        );
    });

    describe('generated create()', function () {
        for (const generatedType of generatedRegistry) {
            it(`should have same result as reflection for ${generatedType.typeName}`, function () {
                const reflectionType = new MessageType(generatedType.typeName, generatedType.fields);
                let reflectionMsg = reflectionType.create();
                let generatedMsg = generatedType.create();
                expect(generatedMsg).toEqual(reflectionMsg);
            });
        }
    });

    it('should have same serialization order regardless of optimization options', function () {
        const reflectionType = new MessageType<TestAllTypesProto3>(TestAllTypesProto3.typeName, [...TestAllTypesProto3.fields].reverse());
        const message = TestAllTypesProto3.fromJson({
            optionalInt32: 123,
            optionalInt64: "1",
            optionalString: "1",
            optionalNestedMessage: {
                a: 2,
            }
        });
        expect(base64encode(TestAllTypesProto3.toBinary(message)))
            .toBe(base64encode(reflectionType.toBinary(message)));
    })

});

