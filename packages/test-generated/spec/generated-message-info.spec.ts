import {fixtures} from "../../test-fixtures";
import type {IMessageType} from "@protobuf-ts/runtime";
import {EnumFieldMessage} from "../ts-out/msg-enum";
import {JsonNamesMessage} from "../ts-out/msg-json-names";
import {MessageFieldMessage} from "../ts-out/msg-message";
import {OneofMessageMemberMessage, OneofScalarMemberMessage} from "../ts-out/msg-oneofs";
import {Proto2OptionalsMessage} from "../ts-out/msg-proto2-optionals";
import {Proto3OptionalsMessage} from "../ts-out/msg-proto3-optionals";
import {DeprecatedFieldMessage, DeprecatedMessage} from "../ts-out/deprecation-explicit";
import {EnumMapMessage, MessageMapMessage, ScalarMapsMessage} from "../ts-out/msg-maps";
import {ImplicitlyDeprecatedMessage} from "../ts-out/deprecation-implicit";

let generatedRegistry: IMessageType<any>[] = [
    DeprecatedMessage,
    JsonNamesMessage,
    EnumMapMessage,
    MessageMapMessage,
    Proto2OptionalsMessage,
    OneofMessageMemberMessage,
    DeprecatedFieldMessage,
    OneofScalarMemberMessage,
    ScalarMapsMessage,
    EnumFieldMessage,
    MessageFieldMessage,
    Proto3OptionalsMessage,
    ImplicitlyDeprecatedMessage
    // will have field info L set if generated with bigints, cant test
    // RepeatedScalarValuesMessage,
    // LongsMessage,
    // ScalarValuesMessage,
];


describe('generated field info equals fixture field infos', function () {


    beforeEach(function () {
        jasmine.addCustomEqualityTester((a, b) => {
            if (typeof a !== "function" || typeof b !== "function") {
                return undefined;
            }
            // we ignore T: () => IMessageType, EnumInfo
            return true;
        });
    });


    fixtures.usingTypeNames((typeName) => {
        let generatedType = generatedRegistry.find(t => t.typeName === typeName);
        if (!generatedType)
            return;
        it(`${typeName}`, function () {
            let generatedFields = generatedType!.fields;
            let fixtureFields = fixtures.makeMessageInfo(typeName).fields;
            expect(generatedFields).toEqual(fixtureFields);
        });

    });
});


