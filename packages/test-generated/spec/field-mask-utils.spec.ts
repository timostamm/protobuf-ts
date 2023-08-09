import {FieldMask} from "../ts-out/google/protobuf/field_mask";
import {
  NestedTestAllTypes,
  TestAllTypes,
  TestOneof2,
} from "../ts-out/google/protobuf/unittest";
import {TestRecursiveMapMessage} from "../ts-out/google/protobuf/map_unittest";
import {makeInt64Value} from "./support/helpers"
import {fieldMaskUtils, MergeOptions} from "@protobuf-ts/runtime";
import {join} from "path";
import {readFileSync} from "fs";

const {
    from,
    fromFieldNumbers,
    fromMessageType,
    isValid,
    mergeMessage,
} = fieldMaskUtils;

/**
 * Other FieldMaskUtils tests can be found in the runtime package.
 * These tests utilize MessageTypes that are generated from protobuf/src/google/protobuf and so must remain here.
 */
describe('FieldMaskUtils', function () {
    // https://github.com/protocolbuffers/protobuf/blob/c9d2bd2fc781/python/google/protobuf/internal/well_known_types_test.py#L423
    describe('fromMessageType()', function () {
        it('returns a FieldMask of all top-level fields in MessageType', () => {
            const {fields} = TestAllTypes;
            const mask = fromMessageType(TestAllTypes);
            expect(fields.length).toEqual(mask.paths.length);
            expect(isValid(TestAllTypes, mask)).toBeTrue();
            for (const fi of fields)
                expect(mask.paths).toContain(fi.name);
        });
    });

    // https://github.com/protocolbuffers/protobuf/blob/c9d2bd2fc781/java/util/src/test/java/com/google/protobuf/util/FieldMaskUtilTest.java#L126
    describe('fromFieldNumbers()', function () {
        it('returns a FieldMask for a MessageType given an array of field numbers in the message', () => {
            let mask = fromFieldNumbers(TestAllTypes, []);
            expect(mask.paths).toEqual([]);
            mask = fromFieldNumbers(TestAllTypes, [1]);
            expect(mask.paths).toEqual(['optional_int32']);
            mask = fromFieldNumbers(TestAllTypes, [1, 2]);
            expect(mask.paths).toEqual(['optional_int32', 'optional_int64']);
            expect(() => {
                mask = fromFieldNumbers(TestAllTypes, [1000]);
            }).toThrowError(/cannot find field number 1000/i);
        });
    });

    // https://github.com/protocolbuffers/protobuf/blob/c9d2bd2fc781/java/util/src/test/java/com/google/protobuf/util/FieldMaskUtilTest.java#L43
    describe('isValid()', function () {
        ([
            [true,  'payload'],
            [false, 'nonexist'],
            [true,  'payload.optional_int32'],
            [true,  'payload.repeated_int32'],
            [true,  'payload.optional_nested_message'],
            [true,  'payload.repeated_nested_message'],
            [true,  from('payload')],
            [false, from('nonexist')],
            [false, from('payload,nonexist')],
            [true,  'payload.optional_nested_message.bb'],
            [false, 'payload.repeated_nested_message.bb', 'Repeated fields cannot have sub-paths.'],
            [false, 'payload.optional_int32.bb', 'Non-message fields cannot have sub-paths.'],
        ] as any[]).forEach(([expected, input, failMessage = 'fail']) => {
            it(`returns ${String(expected)} for ${JSON.stringify(input)}`, () => {
                expect(isValid(NestedTestAllTypes, input)).toBe(expected, failMessage);
            })
        });
    });

    // https://github.com/protocolbuffers/protobuf/blob/c9d2bd2fc781/python/google/protobuf/internal/well_known_types_test.py#L556
    describe('mergeMessage()', function () {
        const goldenFilePath = join(__dirname, '../../proto/google/protobuf/testdata/golden_message_oneof_implemented');
        const goldenMessageBinary = new Uint8Array(readFileSync(goldenFilePath));
        it('merges correctly with just one field set', () => {
            const src = TestAllTypes.fromBinary(goldenMessageBinary);
            TestAllTypes.fields.forEach((fi) => {
                if (fi.oneof)
                    return;
                const fiName = fi.name as keyof TestAllTypes;
                const fiLocalName = fi.localName as keyof TestAllTypes;
                expect(src[fiLocalName]).withContext(`golden message should have set "${fiName}" (field no. ${fi.no})`).toBeDefined();
                const dst = TestAllTypes.create();
                const mask = from(fiName);
                mergeMessage(mask, TestAllTypes, dst, src);
                const expected = TestAllTypes.create({ [fiLocalName]: src[fiLocalName] });
                expect(dst).withContext(`"${fiName}" (field no. ${fi.no})`).toEqual(expected);
            });
        });

        const src = NestedTestAllTypes.create({
            child: {     payload: { optionalInt32: 1234 },
                child: { payload: { optionalInt32: 5678 } },
            },
        });

        it('merges nested fields', () => {
            let dst = NestedTestAllTypes.create();
            let mask = from('child.payload');
            mergeMessage(mask, NestedTestAllTypes, dst, src);
            expect(dst.child?.payload?.optionalInt32).toBe(1234);
            expect(dst.child?.child?.payload?.optionalInt32).toBeUndefined();

            mask = from('child.child.payload');
            mergeMessage(mask, NestedTestAllTypes, dst, src);
            expect(dst.child?.payload?.optionalInt32).toBe(1234);
            expect(dst.child?.child?.payload?.optionalInt32).toBe(5678);

            dst = NestedTestAllTypes.create();
            mergeMessage(mask, NestedTestAllTypes, dst, src);
            expect(dst.child?.payload?.optionalInt32).toBeUndefined();
            expect(dst.child?.child?.payload?.optionalInt32).toBe(5678);

            dst = NestedTestAllTypes.create();
            mask = from('child');
            mergeMessage(mask, NestedTestAllTypes, dst, src);
            expect(dst.child?.payload?.optionalInt32).toBe(1234);
            expect(dst.child?.child?.payload?.optionalInt32).toBe(5678);
        });

        it('(by default) merges message fields. Change the behavior to replace message fields.', () => {
            const int64Value = makeInt64Value(4321).value;
            const dst = NestedTestAllTypes.create({
                child: { payload: { optionalInt64: int64Value } },
            });
            const mask = from('child.payload');
            // (by default) merges message fields.
            mergeMessage(mask, NestedTestAllTypes, dst, src);
            expect(dst.child?.payload?.optionalInt32).toBe(1234);
            expect(dst.child?.payload?.optionalInt64).toBe(int64Value);
            // Change the behavior to replace message fields.
            mergeMessage(mask, NestedTestAllTypes, dst, src, {
                replaceMessages: MergeOptions.ReplaceMessages.ALWAYS
            });
            expect(dst.child?.payload?.optionalInt32).toBe(1234);
            expect(dst.child?.payload?.optionalInt64).toBeUndefined();
        });

        it('(by default) will keep fields if missing in source. But they are cleared when replacing message fields.', () => {
            let dst = NestedTestAllTypes.create({
                payload: { optionalInt32: 1234 },
            });
            const mask = from('payload');
            mergeMessage(mask, NestedTestAllTypes, dst, src);
            expect(dst.payload?.optionalInt32).toBe(1234);
            dst = NestedTestAllTypes.create({
                payload: { optionalInt32: 1234 }
            });
            mergeMessage(mask, NestedTestAllTypes, dst, src, {
                replaceMessages: MergeOptions.ReplaceMessages.ALWAYS
            });
            expect(dst.payload).toBeUndefined();
        });

        it('(by default) will append repeated fields. Change the behavior to replace repeated fields.', () => {
            let src = NestedTestAllTypes.create({
                payload: { repeatedInt32: [1234] },
            });
            let dst = NestedTestAllTypes.create({
                payload: { repeatedInt32: [5678] },
            });
            const mask = FieldMask.fromJson('payload.repeatedInt32');
            // (by default) it will append repeated fields.
            mergeMessage(mask, NestedTestAllTypes, dst, src);
            expect(dst.payload?.repeatedInt32).toEqual([5678, 1234]);
            dst = NestedTestAllTypes.create({
                payload: { repeatedInt32: [5678] },
            });
            // Change the behavior to replace repeated fields.
            mergeMessage(mask, NestedTestAllTypes, dst, src, {
                repeated: MergeOptions.Repeated.REPLACE
            });
            expect(dst.payload?.repeatedInt32).toEqual([1234]);
        });

        it('merges oneof fields', () => {
            const mask = FieldMask.fromJson('fooMessage,fooLazyMessage.quxInt');
            let dst = TestOneof2.fromJson({ fooMessage: { quxInt: '1' } });

            // src does not have any of the foo oneof fields set, so no change to dst
            let src = TestOneof2.create();
            mergeMessage(mask, TestOneof2, dst, src);
            expect(TestOneof2.toJson(dst)).toEqual({ fooMessage: { quxInt: '1' } });

            // the oneof foo field which is set in src is not part of the mask, so no change to dst
            src = TestOneof2.fromJson({ fooInt: 1 });
            mergeMessage(mask, TestOneof2, dst, src);
            expect(TestOneof2.toJson(dst)).toEqual({ fooMessage: { quxInt: '1' } });

            // the oneof foo field which is set in src is part of the mask, but only partially
            src = TestOneof2.fromJson({ fooLazyMessage: { corgeInt: [1], quxInt: '1' } });
            mergeMessage(mask, TestOneof2, dst, src);
            expect(TestOneof2.toJson(dst)).toEqual({ fooLazyMessage: { quxInt: '1' } });
        });

        it('merges map fields', () => {
            const emptyMap = TestRecursiveMapMessage.create();
            const srcLevel2 = TestRecursiveMapMessage.create({ a: {
                ['src level 2']: TestRecursiveMapMessage.clone(emptyMap),
            }});
            const src = TestRecursiveMapMessage.create({ a: {
                ['common key']: TestRecursiveMapMessage.clone(srcLevel2),
                ['src level 1']: TestRecursiveMapMessage.clone(srcLevel2),
            }});

            const dstLevel2 = TestRecursiveMapMessage.create({ a: {
                ['dst level 2']: TestRecursiveMapMessage.clone(emptyMap),
            }});
            const dst = TestRecursiveMapMessage.create({ a: {
                ['common key']: TestRecursiveMapMessage.clone(dstLevel2),
                ['dst level 1']: TestRecursiveMapMessage.clone(emptyMap),
            }});

            const mask = from('a');
            mergeMessage(mask, TestRecursiveMapMessage, dst, src);
            
            // map from dst is replaced with map from src.
            expect(dst.a['common key']).toEqual(srcLevel2);
            expect(dst.a['src level 1']).toEqual(srcLevel2);
            expect(dst.a['dst level 1']).toEqual(emptyMap);
        });

        it('throws for bad merge paths (repeated fields)', () => {
            const src = TestAllTypes.fromBinary(goldenMessageBinary);
            const dst = TestAllTypes.create();
            const mask = FieldMask.fromJson('optionalInt32.field');
            expect(() => mergeMessage(mask, TestAllTypes, dst, src)).toThrowError(
                'Field optional_int32 in message protobuf_unittest.TestAllTypes ' +
                'is not a singular message field and cannot have sub-fields.'
            );
        });
    });

});
