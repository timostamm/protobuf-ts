import {IMessageType, MessageType} from "@protobuf-ts/runtime";
import {EnumFieldMessage} from "../ts-out/msg-enum";
import {JsonNamesMessage} from "../ts-out/msg-json-names";
import {MessageFieldMessage} from "../ts-out/msg-message";
import {OneofMessageMemberMessage, OneofScalarMemberMessage} from "../ts-out/msg-oneofs";
import {Proto2OptionalsMessage} from "../ts-out/msg-proto2-optionals";
import {Proto3OptionalsMessage} from "../ts-out/msg-proto3-optionals";
import {RepeatedScalarValuesMessage, ScalarValuesMessage} from "../ts-out/msg-scalar";

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

});

