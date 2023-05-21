import { FieldMask as FieldMask_Speed } from "../ts-out/speed/google/protobuf/field_mask";
import { FieldMask as FieldMask_Size } from "../ts-out/size/google/protobuf/field_mask";
import { FieldMask as FieldMask_SpeedBigInt } from "../ts-out/speed-bigint/google/protobuf/field_mask";
import { FieldMask as FieldMask_SizeBigInt } from "../ts-out/size-bigint/google/protobuf/field_mask";

describe("google.protobuf.FieldMask", function () {
  const msgs = {
    speed: FieldMask_Speed,
    size: FieldMask_Size,
    speedBigInt: FieldMask_SpeedBigInt,
    sizeBigInt: FieldMask_SizeBigInt,
  };

  Object.entries(msgs).forEach(([name, messageType]) => {
    describe("toJson() " + name, function () {
      it("returns expected JSON", function () {
        let mask = messageType.create({
          paths: ["user.display_name", "photo"],
        });
        let json = messageType.toJson(mask);
        expect(json).toBe("user.displayName,photo");
      });
      it('ignores "useProtoFieldName" option', function () {
        let mask = messageType.create({
          paths: ["user.display_name", "photo"],
        });
        let json = messageType.toJson(mask, {
          useProtoFieldName: true,
        });
        expect(json).toBe("user.displayName,photo");
      });
    });

    describe("fromJson() " + name, function () {
      it("parses JSON as expected", function () {
        let expected = messageType.create({
          paths: ["user.display_name", "photo"],
        });
        let actual = messageType.fromJson("user.displayName,photo");
        expect(actual).toEqual(expected);
      });
    });
  });
});
