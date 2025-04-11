import type {IMessageType} from "@protobuf-ts/runtime";
import {reflectionCreate} from "@protobuf-ts/runtime";
import {EnumFieldMessage} from "../gen/msg-enum";
import {MessageMapMessage, ScalarMapsMessage} from "../gen/msg-maps";
import {OneofMessageMemberMessage, OneofScalarMemberMessage} from "../gen/msg-oneofs";
import {TestAllTypesProto3} from "../gen/google/protobuf/test_messages_proto3";
import {TestAllTypesProto2} from "../gen/google/protobuf/test_messages_proto2";

// Copied from test-default/reflection-create.spec.ts. Do not edit.
describe('reflectionCreate()', function () {
    const types: IMessageType<any>[] = [
        EnumFieldMessage,
        ScalarMapsMessage,
        MessageMapMessage,
        OneofScalarMemberMessage,
        OneofMessageMemberMessage,
        TestAllTypesProto3,
        TestAllTypesProto2,
    ];
    for (const type of types) {
        describe(`with message type ${type.typeName}`, () => {
            it("creates the same object as create()", function () {
                const message = reflectionCreate(type);
                expect(message).toEqual(type.create());
            });
        });
    }

    describe(TestAllTypesProto3.typeName, function () {
        it("creates expected object", function () {
            const message = reflectionCreate(TestAllTypesProto3);
            expect(message.optionalInt32).toBe(0);
            expect(message.optionalUint32).toBe(0);
            expect(message.optionalSint32).toBe(0);
            expect(message.optionalFixed32).toBe(0);
            expect(message.optionalSfixed32).toBe(0);
            expect(message.optionalFloat).toBe(0);
            expect(message.optionalDouble).toBe(0);
            expect(message.optionalBool).toBe(false);
            expect(message.optionalString).toBe("");
            expect(message.optionalBool).toBe(false);
            expect(message.optionalBytes).toEqual(new Uint8Array(0));
            expect(message.optionalBytes).toEqual(new Uint8Array(0));
            expect(message.optionalNestedEnum).toBe(0);
            expect(message.optionalForeignEnum).toBe(0);
            expect(message.optionalAliasedEnum).toBe(0);
            expect(message.optionalStringPiece).toBe("");
            expect(message.optionalCord).toBe("");
            expect(message.repeatedInt32).toEqual([]);
            expect(message.repeatedInt64).toEqual([]);
            expect(message.repeatedUint32).toEqual([]);
            expect(message.repeatedUint64).toEqual([]);
            expect(message.repeatedSint32).toEqual([]);
            expect(message.repeatedSint64).toEqual([]);
            expect(message.repeatedFixed32).toEqual([]);
            expect(message.repeatedFixed64).toEqual([]);
            expect(message.repeatedSfixed32).toEqual([]);
            expect(message.repeatedSfixed64).toEqual([]);
            expect(message.repeatedFloat).toEqual([]);
            expect(message.repeatedDouble).toEqual([]);
            expect(message.repeatedBool).toEqual([]);
            expect(message.repeatedString).toEqual([]);
            expect(message.repeatedBytes).toEqual([]);
            expect(message.repeatedNestedMessage).toEqual([]);
            expect(message.repeatedForeignMessage).toEqual([]);
            expect(message.repeatedNestedEnum).toEqual([]);
            expect(message.repeatedForeignEnum).toEqual([]);
            expect(message.repeatedStringPiece).toEqual([]);
            expect(message.repeatedCord).toEqual([]);
            expect(message.packedInt32).toEqual([]);
            expect(message.packedInt64).toEqual([]);
            expect(message.packedUint32).toEqual([]);
            expect(message.packedUint64).toEqual([]);
            expect(message.packedSint32).toEqual([]);
            expect(message.packedSint64).toEqual([]);
            expect(message.packedFixed32).toEqual([]);
            expect(message.packedFixed64).toEqual([]);
            expect(message.packedSfixed32).toEqual([]);
            expect(message.packedSfixed64).toEqual([]);
            expect(message.packedFloat).toEqual([]);
            expect(message.packedDouble).toEqual([]);
            expect(message.packedBool).toEqual([]);
            expect(message.packedNestedEnum).toEqual([]);
            expect(message.unpackedInt32).toEqual([]);
            expect(message.unpackedInt64).toEqual([]);
            expect(message.unpackedUint32).toEqual([]);
            expect(message.unpackedUint64).toEqual([]);
            expect(message.unpackedSint32).toEqual([]);
            expect(message.unpackedSint64).toEqual([]);
            expect(message.unpackedFixed32).toEqual([]);
            expect(message.unpackedFixed64).toEqual([]);
            expect(message.unpackedSfixed32).toEqual([]);
            expect(message.unpackedSfixed64).toEqual([]);
            expect(message.unpackedFloat).toEqual([]);
            expect(message.unpackedDouble).toEqual([]);
            expect(message.unpackedBool).toEqual([]);
            expect(message.unpackedNestedEnum).toEqual([]);
            expect(message.mapInt32Int32).toEqual({});
            expect(message.mapInt64Int64).toEqual({});
            expect(message.mapUint32Uint32).toEqual({});
            expect(message.mapUint64Uint64).toEqual({});
            expect(message.mapSint32Sint32).toEqual({});
            expect(message.mapSint64Sint64).toEqual({});
            expect(message.mapFixed32Fixed32).toEqual({});
            expect(message.mapFixed64Fixed64).toEqual({});
            expect(message.mapSfixed32Sfixed32).toEqual({});
            expect(message.mapSfixed64Sfixed64).toEqual({});
            expect(message.mapInt32Float).toEqual({});
            expect(message.mapInt32Double).toEqual({});
            expect(message.mapBoolBool).toEqual({});
            expect(message.mapStringString).toEqual({});
            expect(message.mapStringBytes).toEqual({});
            expect(message.mapStringNestedMessage).toEqual({});
            expect(message.mapStringForeignMessage).toEqual({});
            expect(message.mapStringNestedEnum).toEqual({});
            expect(message.mapStringForeignEnum).toEqual({});
            expect(message.oneofField).toEqual({oneofKind: undefined});
            expect(message.repeatedBoolWrapper).toEqual([]);
            expect(message.repeatedBoolWrapper).toEqual([]);
            expect(message.repeatedInt32Wrapper).toEqual([]);
            expect(message.repeatedInt64Wrapper).toEqual([]);
            expect(message.repeatedUint32Wrapper).toEqual([]);
            expect(message.repeatedUint64Wrapper).toEqual([]);
            expect(message.repeatedFloatWrapper).toEqual([]);
            expect(message.repeatedDoubleWrapper).toEqual([]);
            expect(message.repeatedStringWrapper).toEqual([]);
            expect(message.repeatedBytesWrapper).toEqual([]);
            expect(message.repeatedDuration).toEqual([]);
            expect(message.repeatedTimestamp).toEqual([]);
            expect(message.repeatedFieldmask).toEqual([]);
            expect(message.repeatedStruct).toEqual([]);
            expect(message.repeatedAny).toEqual([]);
            expect(message.repeatedValue).toEqual([]);
            expect(message.repeatedListValue).toEqual([]);
            expect(message.fieldname1).toBe(0);
            expect(message.fieldName2).toBe(0);
            expect(message.FieldName3).toBe(0);
            expect(message.fieldName4).toBe(0);
            expect(message.field0Name5).toBe(0);
            expect(message.field0Name6).toBe(0);
            expect(message.fieldName7).toBe(0);
            expect(message.fieldName8).toBe(0);
            expect(message.fieldName9).toBe(0);
            expect(message.fieldName10).toBe(0);
            expect(message.fIELDNAME11).toBe(0);
            expect(message.fIELDName12).toBe(0);
            expect(message.FieldName13).toBe(0);
            expect(message.FieldName14).toBe(0);
            expect(message.fieldName15).toBe(0);
            expect(message.fieldName16).toBe(0);
            expect(message.fieldName17).toBe(0);
            expect(message.fieldName18).toBe(0);

            // The following fields may be generated as bigint, number, or string,
            // depending on plugin options and field option JS_TYPE.
            // We should cover all three cases explicitly, but we currently cannot,
            // because the same tests are run on different generated code.
            // For now, we simply convert to number.
            expect(message.optionalInt64).toBeDefined();
            expect(Number(message.optionalInt64)).toEqual(0);
            expect(message.optionalUint64).toBeDefined();
            expect(Number(message.optionalUint64)).toEqual(0);
            expect(message.optionalSint64).toBeDefined();
            expect(Number(message.optionalSint64)).toEqual(0);
            expect(message.optionalFixed64).toBeDefined();
            expect(Number(message.optionalFixed64)).toEqual(0);
            expect(message.optionalSfixed64).toBeDefined();
            expect(Number(message.optionalSfixed64)).toEqual(0);
        });
    });

});
