import {FieldMask} from "../ts-out/google/protobuf/field_mask";

describe('google.protobuf.FieldMask', function () {


    describe('toJson()', function () {
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
