import {FieldMask} from "../gen/google/protobuf/field_mask";

// Copied from test-default/google.protobuf.field_mask.spec.ts. Do not edit.
describe('google.protobuf.FieldMask', function () {

    describe('toJson()', function () {
        // Based on https://github.com/protocolbuffers/protobuf/blob/e8ae137c96444ea313485ed1118c5e43b2099cf1/src/google/protobuf/util/field_mask_util_test.cc#L69-L82
        it('converts snake_case to camelCase', function () {
            let mask: FieldMask = { paths: [] };
            function snakeToCamel(s: string) {
                mask.paths[0] = s;
                return FieldMask.toJson(mask);
            }
            expect(snakeToCamel('foo_bar')).toBe('fooBar');
            expect(snakeToCamel('_foo_bar')).toBe('FooBar');
            expect(snakeToCamel('foo3_bar')).toBe('foo3Bar');
            // No uppercase letter is allowed.
            expect(() => snakeToCamel('Foo')).toThrowError();
            // Any character after a "_" must be a lowercase letter.
            //   1. "_" cannot be followed by another "_".
            //   2. "_" cannot be followed by a digit.
            //   3. "_" cannot appear as the last character.
            expect(() => snakeToCamel('foo__bar')).toThrowError();
            expect(() => snakeToCamel('foo_3bar')).toThrowError();
            expect(() => snakeToCamel('foo_bar_')).toThrowError();
        });
        it('returns expected JSON', function () {
            let mask: FieldMask = {
                paths: [
                    'user.display_name',
                    'photo',
                ]
            };
            let json = FieldMask.toJson(mask);
            expect(json).toBe("user.displayName,photo");
        });
        it('ignores "useProtoFieldName" option', function () {
            let mask: FieldMask = {
                paths: [
                    'user.display_name',
                    'photo',
                ]
            };
            let json = FieldMask.toJson(mask, {
                useProtoFieldName: true
            });
            expect(json).toBe("user.displayName,photo");
        });
    });

    describe('fromJson()', function () {
        // Based on https://github.com/protocolbuffers/protobuf/blob/e8ae137c96444ea313485ed1118c5e43b2099cf1/src/google/protobuf/util/field_mask_util_test.cc#L84-L90
        it('converts camelCase to snake_case', function () {
            function camelToSnake(s: string) {
                return FieldMask.fromJson(s).paths[0];
            }
            expect(camelToSnake('fooBar')).toBe('foo_bar');
            expect(camelToSnake('FooBar')).toBe('_foo_bar');
            expect(camelToSnake('foo3Bar')).toBe('foo3_bar');
            // "_"s are not allowed.
            expect(() => camelToSnake('foo_bar')).toThrowError();
        });
        it('parses JSON as expected', function () {
            let expected: FieldMask = {
                paths: [
                    'user.display_name',
                    'photo',
                ]
            };
            let actual = FieldMask.fromJson("user.displayName,photo");
            expect(actual).toEqual(expected);
        });
    });

});
