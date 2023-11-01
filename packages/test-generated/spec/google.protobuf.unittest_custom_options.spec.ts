import * as o from "../ts-out/google/protobuf/unittest_custom_options";

import {
    JsonObject,
    MESSAGE_TYPE,
    containsMessageType,
    readEnumOption,
    readEnumValueOption,
    readFieldOption,
    readMessageOption,
    readOneofOption
} from "@protobuf-ts/runtime";
import {readMethodOption, readServiceOption} from "@protobuf-ts/runtime-rpc";

describe('message options', function () {
    it('should exist', function () {
        expect(o.TestMessageWithCustomOptions.options).toEqual({
            "protobuf_unittest.message_opt1": -56
        });
        // We don't support all of proto2 (groups, message extensions) so we're
        // only checking what can be parsed under proto3. This matches the test
        // which the official C# uses as it also only supports proto3:
        // https://github.com/protocolbuffers/protobuf/blob/ebcfaa5a17e7ecd4cc01ab877d5bc11563186dc0/csharp/src/Google.Protobuf.Test/Reflection/CustomOptionsTest.cs#L109-L123
        // We'd use their unittest_custom_options_proto3.proto file but it's not
        // available under `src/google/protobuf` as C# is the only one that needs it:
        // https://github.com/protocolbuffers/protobuf/blob/ebcfaa5a17e7ecd4cc01ab877d5bc11563186dc0/csharp/protos/unittest_custom_options_proto3.proto#L37-L42
        expect(o.VariousComplexOptions.options).toEqual({
            "protobuf_unittest.complex_opt1": { foo: 42, foo4: [99, 88] },
            "protobuf_unittest.complex_opt2": {
                baz: 987,
                bar: { foo: 743 },
                fred: { waldo: 321 },
                barney: [{ waldo: 101 }, { waldo: 212 }]
            },
            "protobuf_unittest.complex_opt3": { qux: 9 }
        });
    });

    describe('read via `readMessageOption()`', function () {
        it('should return the message option as JSON', function () {
            let simple = readMessageOption(
                o.TestMessageWithCustomOptions,
                "protobuf_unittest.message_opt1"
            );
            expect(simple).toBe(-56);
            let complex = readMessageOption(
                o.VariousComplexOptions,
                "protobuf_unittest.complex_opt1"
            )!;
            expect(containsMessageType(complex as JsonObject)).toBeFalse();
            expect(complex).toEqual({ foo: 42, foo4: [99, 88] });
        });
        it('should return the message option with type', function () {
            let complex = readMessageOption(
                o.VariousComplexOptions,
                "protobuf_unittest.complex_opt1",
                o.ComplexOptionType1
            )!;

            expect(containsMessageType(complex) && complex[MESSAGE_TYPE]).toBe(o.ComplexOptionType1);
            expect(complex).toEqual({ foo: 42, foo4: [99, 88] });
        });
    });
});

describe('oneof options', function () {
    it('should exist', function () {
        expect(o.TestMessageWithCustomOptions.oneofOptions).toEqual({
            anOneof: { "protobuf_unittest.oneof_opt1": -99 }
        });
    });

    describe('read via `readOneofOption()`', function () {
        it('should return the oneof option as JSON', function () {
            let simple = readOneofOption(
                o.TestMessageWithCustomOptions,
                "anOneof",
                "protobuf_unittest.oneof_opt1"
            );
            expect(simple).toBe(-99);
        });
    });
});

describe('enum options', function () {
    it('should exist', function () {
        expect(o.TestMessageWithCustomOptions_AnEnumInfo[3]?.options).toEqual({
            "protobuf_unittest.enum_opt1": -789
        });
        expect(o.AggregateEnumInfo[3]?.options).toEqual({
            "protobuf_unittest.enumopt": { s: "EnumAnnotation" }
        });
    });

    describe('read via `readEnumOption()`', function () {
        it('should return the enum option as JSON', function () {
            let simple = readEnumOption(
                o.TestMessageWithCustomOptions_AnEnum,
                "protobuf_unittest.enum_opt1"
            );
            expect(simple).toBe(-789);
            let complex = readEnumOption(
                o.AggregateEnum,
                "protobuf_unittest.enumopt"
            )!;
            expect(containsMessageType(complex as JsonObject)).toBeFalse();
            expect(complex).toEqual({ s: "EnumAnnotation" });
        });

        it('should return the enum option with type', function () {
            let complex = readEnumOption(
                o.AggregateEnum,
                "protobuf_unittest.enumopt",
                o.Aggregate
            )!;
            expect(containsMessageType(complex) && complex[MESSAGE_TYPE]).toBe(o.Aggregate);
            expect(complex).toEqual({ s: "EnumAnnotation" });
        });
    });
});

describe('enum value options', function () {
    it('should exist', function () {
        expect(o.TestMessageWithCustomOptions_AnEnumInfo[3]?.valueOptions).toEqual({
            ANENUM_VAL2: { "protobuf_unittest.enum_value_opt1": 123 }
        });
        expect(o.AggregateEnumInfo[3]?.valueOptions).toEqual({
            VALUE: { "protobuf_unittest.enumvalopt": { s: "EnumValueAnnotation" } }
        });
    });

    describe('read via `readEnumValueOption()`', function () {
        it('should return the enum value option as JSON', function () {
            // via MyEnum.VAL
            let simple = readEnumValueOption(
                o.TestMessageWithCustomOptions_AnEnum,
                o.TestMessageWithCustomOptions_AnEnum.ANENUM_VAL2,
                "protobuf_unittest.enum_value_opt1"
            );
            expect(simple).toBe(123);
            // via MyEnum[MyEnum.VAL]
            simple = readEnumValueOption(
                o.TestMessageWithCustomOptions_AnEnum,
                o.TestMessageWithCustomOptions_AnEnum[
                    o.TestMessageWithCustomOptions_AnEnum.ANENUM_VAL2
                ],
                "protobuf_unittest.enum_value_opt1"
            );
            expect(simple).toBe(123);
            // via "VAL"
            simple = readEnumValueOption(
                o.TestMessageWithCustomOptions_AnEnum,
                "ANENUM_VAL2",
                "protobuf_unittest.enum_value_opt1"
            );
            expect(simple).toBe(123);
            let complex = readEnumValueOption(
                o.AggregateEnum,
                "VALUE",
                "protobuf_unittest.enumvalopt"
            )!;
            expect(containsMessageType(complex as JsonObject)).toBeFalse();
            expect(complex).toEqual({ s: "EnumValueAnnotation" });
        });

        it('should return the enum value option with type', function () {
            let complex = readEnumValueOption(
                o.AggregateEnum,
                "VALUE",
                "protobuf_unittest.enumvalopt",
                o.Aggregate
            )!;
            expect(containsMessageType(complex) && complex[MESSAGE_TYPE]).toBe(o.Aggregate);
            expect(complex).toEqual({ s: "EnumValueAnnotation" });
        });
    });
});

describe('field options', function () {
    it('should exist', function () {
        expect(o.TestMessageWithCustomOptions.fields[0].options).toEqual({
            "protobuf_unittest.field_opt1": "8765432109"
        });
        expect(o.AggregateMessage.fields[0]?.options).toEqual({
            "protobuf_unittest.fieldopt": { s: "FieldAnnotation" }
        });
    });

    describe('read via `readFieldOption()`', function () {
        it('should return the field option as JSON', function () {
            let simple = readFieldOption(
                o.TestMessageWithCustomOptions,
                "field1",
                "protobuf_unittest.field_opt1"
            );
            expect(simple).toBe("8765432109");
            let complex = readFieldOption(
                o.AggregateMessage,
                "fieldname",
                "protobuf_unittest.fieldopt"
            )!;
            expect(containsMessageType(complex as JsonObject)).toBeFalse();
            expect(complex).toEqual({ s: "FieldAnnotation" });
        });

        it('should return the field option with type', function () {
            let complex = readFieldOption(
                o.AggregateMessage,
                "fieldname",
                "protobuf_unittest.fieldopt",
                o.Aggregate
            )!;
            expect(containsMessageType(complex) && complex[MESSAGE_TYPE]).toBe(o.Aggregate);
            expect(complex).toEqual({ s: "FieldAnnotation" });
        });
    });
});

describe('service options', function () {
    it('should exist', function () {
        expect(o.TestServiceWithCustomOptions.options).toEqual({
            "protobuf_unittest.service_opt1": "-9876543210"
        });
        expect(o.AggregateService.options).toEqual({
            "protobuf_unittest.serviceopt": { s: "ServiceAnnotation" }
        });
    });

    describe('read via `readServiceOption()`', function () {
        it('should return the service option as JSON', function () {
            let simple = readServiceOption(
                o.TestServiceWithCustomOptions,
                "protobuf_unittest.service_opt1"
            );
            expect(simple).toBe("-9876543210");
            let complex = readServiceOption(
                o.AggregateService,
                "protobuf_unittest.serviceopt"
            )!;
            expect(containsMessageType(complex as JsonObject)).toBeFalse();
            expect(complex).toEqual({ s: "ServiceAnnotation" });
        });
        it('should return the service option with type', function () {
            let complex = readServiceOption(
                o.AggregateService,
                "protobuf_unittest.serviceopt",
                o.Aggregate
            )!;

            expect(containsMessageType(complex) && complex[MESSAGE_TYPE]).toBe(o.Aggregate);
            expect(complex).toEqual({ s: "ServiceAnnotation" });
        });
    });
});

describe('method options', function () {
    it('should exist', function () {
        expect(o.TestServiceWithCustomOptions.methods[0].options).toEqual({
            "protobuf_unittest.method_opt1": "METHODOPT1_VAL2"
        });
        expect(o.AggregateService.methods[0].options).toEqual({
            "protobuf_unittest.methodopt": { s: "MethodAnnotation" }
        });
    });

    describe('read via `readMethodOption()`', function () {
        it('should return the method option as JSON', function () {
            let simple = readMethodOption(
                o.TestServiceWithCustomOptions,
                "foo",
                "protobuf_unittest.method_opt1"
            );
            expect(simple).toBe("METHODOPT1_VAL2");
            let complex = readMethodOption(
                o.AggregateService,
                "method",
                "protobuf_unittest.methodopt"
            )!;
            expect(containsMessageType(complex as JsonObject)).toBeFalse();
            expect(complex).toEqual({ s: "MethodAnnotation" });
        });
        it('should return the method option with type', function () {
            let complex = readMethodOption(
                o.AggregateService,
                "method",
                "protobuf_unittest.methodopt",
                o.Aggregate
            )!;

            expect(containsMessageType(complex) && complex[MESSAGE_TYPE]).toBe(o.Aggregate);
            expect(complex).toEqual({ s: "MethodAnnotation" });
        });
    });
});