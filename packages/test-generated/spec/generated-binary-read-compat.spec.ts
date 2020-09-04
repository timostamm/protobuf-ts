import {fixtures} from "../../test-fixtures";
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

    describe('generated create() produces same data as reflection', function () {
        fixtures.usingTypeNames((typeName) => {
            let generatedType = generatedRegistry.find(t => t.typeName === typeName);
            if (!generatedType)
                return;

            it(`${typeName}`, function () {
                let reflectionType = new MessageType(generatedType!.typeName, generatedType!.fields);
                let reflectionMsg = reflectionType.create();
                let generatedMsg = generatedType!.create();
                expect(generatedMsg).toEqual(reflectionMsg);
            });
        });
    });

    describe('generated toBinary() produces same data as reflection', function () {
        // using json because fixture data uses LongType.STRING, but generated code also uses LongType.BIGINT
        fixtures.usingJson((typeName, key, json) => {
            let generatedType = generatedRegistry.find(t => t.typeName === typeName);
            if (!generatedType)
                return;

            it(`${typeName} '${key}'`, function () {
                let reflectionType = new MessageType(generatedType!.typeName, generatedType!.fields);
                let msg = reflectionType.fromJson(json);
                let reflectionBytes = reflectionType.toBinary(msg);
                let generatedBytes = generatedType!.toBinary(msg);
                expect(generatedBytes).toEqual(reflectionBytes);
            });
        });
    });


    describe('generated fromBinary() produces same data as reflection', function () {
        // using json because fixture data uses LongType.STRING, but generated code also uses LongType.BIGINT
        fixtures.usingJson((typeName, key, json) => {
            let generatedType = generatedRegistry.find(t => t.typeName === typeName);
            if (!generatedType)
                return;
            it(`${typeName} '${key}'`, function () {
                let reflectionType = new MessageType(generatedType!.typeName, generatedType!.fields);
                let msg = reflectionType.fromJson(json);
                let bytes = reflectionType.toBinary(msg);
                let msgRead = generatedType!.fromBinary(bytes);
                expect(msgRead).toEqual(msg);
            });
        });
    });

});

