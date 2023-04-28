import type {IMessageType, PartialMessage, UnknownMessage} from "@protobuf-ts/runtime";
import {normalizeFieldInfo, reflectionCreate, reflectionEquals, reflectionMergePartial, MessageType, ScalarType} from "@protobuf-ts/runtime";
import {EnumFieldMessage} from "../ts-out/msg-enum";
import {MessageMapMessage, ScalarMapsMessage} from "../ts-out/msg-maps";
import {OneofMessageMemberMessage, OneofScalarMemberMessage} from "../ts-out/msg-oneofs";


enum TestEnum {
    A = 0,
    B = 1,
    C = 2,
}


describe('reflectionEquals()', function () {
        const types: IMessageType<any>[] = [
                    EnumFieldMessage,
                    ScalarMapsMessage,
                    MessageMapMessage,
                    OneofScalarMemberMessage,
                    OneofMessageMemberMessage,
                ];


    beforeEach(function () {
        jasmine.addCustomEqualityTester((a, b) =>
            (a instanceof Uint8Array && b instanceof Uint8Array) ? a.byteLength === b.byteLength : undefined
        );
    });


    it('should return true for same instance', function () {
        let eq = reflectionEquals({typeName: "test", fields: [], options: {}}, {}, {});
        expect(eq).toBeTrue();
    });

    it('should return true for undefined, undefined', function () {
        let eq = reflectionEquals({typeName: "test", fields: [], options: {}}, undefined, undefined);
        expect(eq).toBeTrue();
    });

    it('should return false for message, undefined', function () {
        let eq = reflectionEquals({typeName: "test", fields: [], options: {}}, {}, undefined);
        expect(eq).toBeFalse();
    });

    it('should return false for different scalar field value', function () {
        let eq = reflectionEquals({
            typeName: "test", fields: [
                normalizeFieldInfo({no: 1, name: "value", kind: "scalar", T: ScalarType.INT32}),
                normalizeFieldInfo({no: 2, name: "unit", kind: "enum", T: () => ["spec.TestEnum", TestEnum]})
            ], options: {}
        }, {
            unit: 1,
            value: 429,
        }, {
            unit: 1,
            value: 458,
        });
        expect(eq).toBeFalse();
    });

    it('should ignore excess properties', function () {
        let info = {typeName: "test", fields: [], options: {}};
        let eq = reflectionEquals(info, {x: 123}, {});
        expect(eq).toBeTrue();
    });

    it('should detect non-equal bytes fields', function () {
        let info = {
            typeName: "test",
            fields: [normalizeFieldInfo({no: 1, name: "bytes", kind: "scalar", T: ScalarType.BYTES})],
            options: {}
        };
        let a = {bytes: new Uint8Array([1, 2, 3])};
        let b = {bytes: new Uint8Array([4, 5, 6])};
        let c = {bytes: new Uint8Array([1, 2, 3])};
        expect(reflectionEquals(info, a, b)).toBeFalse();
        expect(reflectionEquals(info, a, c)).toBeTrue();
    });

    it('oneofs are equal', () => {
        const mi = {
            typeName: OneofScalarMemberMessage.typeName,
            fields: OneofScalarMemberMessage.fields.map(normalizeFieldInfo),
            options: {}
        };
        const msg = {
            result: {
                oneofKind: "value",
                value: 42
            }
        } as PartialMessage<OneofScalarMemberMessage>;
        const mt = new MessageType<UnknownMessage>(mi.typeName, mi.fields, mi.options);
        const message = reflectionCreate(mt);
        reflectionMergePartial(mi, message, msg);
        let eq = reflectionEquals(mi, msg, message);
        expect(eq).toBeTrue();
    });

    // describe('should behave like jasmine equality comparator for all fixture messages', function () {
    //     fixtures.usingMessages((typeName, key, msg) => {
    //         it(`${typeName} '${key}'`, function () {
    //             const mi = fixtures.makeMessageInfo(typeName);
    //             const mt = new MessageType<UnknownMessage>(mi.typeName, mi.fields, mi.options);
    //             let copy = reflectionCreate(mt);
    //             reflectionMergePartial(mi, copy, msg);
    //             let eq = reflectionEquals(mi, msg, copy);
    //             if (eq)
    //                 expect(msg).toEqual(copy);
    //             else
    //                 expect(msg).not.toEqual(copy);
    //         });
    //     });
    // });


    // for (const type of types) {
    //     describe(`with message type ${type.typeName}`, () => {
    //         it("determines messages to be equal", function () {
    //             const mi = {
    //                 typeName: type.typeName,
    //                 fields: type.fields.map(normalizeFieldInfo),
    //                 options: {}
    //             };
    //             // Is there a way to do this dynamically for each generated type without a fixture?
    //             const msg = {};
    //             const message = reflectionCreate(type);
    //             reflectionMergePartial(mi, message, {});
    //             let eq = reflectionEquals(mi, {}, message);
    //             expect(eq).toBeTrue();
    //         });
    //     });
    // }

    // for (const type of types) {
    //     describe(`with message type ${type.typeName}`, () => {
    //         it("determines messages to be equal", function () {
    //             const mi = {
    //                 typeName: type.typeName,
    //                 fields: type.fields.map(normalizeFieldInfo),
    //                 options: {}
    //             };
    //             // Is there a way to do this dynamically for each generated type without a fixture?
    //             const msg = {};
    //             const message = reflectionCreate(type);
    //             reflectionMergePartial(mi, message, msg);
    //             let eq = reflectionEquals(mi, msg, message);
    //             if (eq) {
    //                 expect(msg).toEqual(message);
    //             } else {
    //                 expect(msg).not.toEqual(message);
    //             }
    //         });
    //     });
    // }

});
