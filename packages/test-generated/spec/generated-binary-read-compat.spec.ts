import { IMessageType, MessageType } from "@protobuf-ts/runtime";
import { EnumFieldMessage as Enum_Speed } from "../ts-out/speed/msg-enum";
import { EnumFieldMessage as Enum_Size } from "../ts-out/size/msg-enum";
import { EnumFieldMessage as Enum_SpeedBigInt } from "../ts-out/speed-bigint/msg-enum";
import { EnumFieldMessage as Enum_SizeBigInt } from "../ts-out/size-bigint/msg-enum";
import { JsonNamesMessage as JsonNames_Speed } from "../ts-out/speed/msg-json-names";
import { JsonNamesMessage as JsonNames_Size } from "../ts-out/size/msg-json-names";
import { JsonNamesMessage as JsonNames_SpeedBigInt } from "../ts-out/speed-bigint/msg-json-names";
import { JsonNamesMessage as JsonNames_SizeBigInt } from "../ts-out/size-bigint/msg-json-names";
import { MessageFieldMessage as Message_Speed } from "../ts-out/speed/msg-message";
import { MessageFieldMessage as Message_Size } from "../ts-out/size/msg-message";
import { MessageFieldMessage as Message_SpeedBigInt } from "../ts-out/speed-bigint/msg-message";
import { MessageFieldMessage as Message_SizeBigInt } from "../ts-out/size-bigint/msg-message";
import {
  OneofMessageMemberMessage as OneofMessage_Speed,
  OneofScalarMemberMessage as OneofScalar_Speed,
} from "../ts-out/speed/msg-oneofs";
import {
  OneofMessageMemberMessage as OneofMessage_Size,
  OneofScalarMemberMessage as OneofScalar_Size,
} from "../ts-out/size/msg-oneofs";
import {
  OneofMessageMemberMessage as OneofMessage_SpeedBigInt,
  OneofScalarMemberMessage as OneofScalar_SpeedBigInt,
} from "../ts-out/speed-bigint/msg-oneofs";
import {
  OneofMessageMemberMessage as OneofMessage_SizeBigInt,
  OneofScalarMemberMessage as OneofScalar_SizeBigInt,
} from "../ts-out/size-bigint/msg-oneofs";
import { Proto2OptionalsMessage as Proto2_Speed } from "../ts-out/speed/msg-proto2-optionals";
import { Proto2OptionalsMessage as Proto2_Size } from "../ts-out/size/msg-proto2-optionals";
import { Proto2OptionalsMessage as Proto2_SpeedBigInt } from "../ts-out/speed-bigint/msg-proto2-optionals";
import { Proto2OptionalsMessage as Proto2_SizeBigInt } from "../ts-out/size-bigint/msg-proto2-optionals";
import { Proto3OptionalsMessage as Proto3_Speed } from "../ts-out/speed/msg-proto3-optionals";
import { Proto3OptionalsMessage as Proto3_Size } from "../ts-out/size/msg-proto3-optionals";
import { Proto3OptionalsMessage as Proto3_SpeedBigInt } from "../ts-out/speed-bigint/msg-proto3-optionals";
import { Proto3OptionalsMessage as Proto3_SizeBigInt } from "../ts-out/size-bigint/msg-proto3-optionals";
import {
  RepeatedScalarValuesMessage as RepeatedScalar_Speed,
  ScalarValuesMessage as Scalar_Speed,
} from "../ts-out/speed/msg-scalar";
import {
  RepeatedScalarValuesMessage as RepeatedScalar_Size,
  ScalarValuesMessage as Scalar_Size,
} from "../ts-out/size/msg-scalar";
import {
  RepeatedScalarValuesMessage as RepeatedScalar_SpeedBigInt,
  ScalarValuesMessage as Scalar_SpeedBigInt,
} from "../ts-out/speed-bigint/msg-scalar";
import {
  RepeatedScalarValuesMessage as RepeatedScalar_SizeBigInt,
  ScalarValuesMessage as Scalar_SizeBigInt,
} from "../ts-out/size-bigint/msg-scalar";

let generatedRegistry: IMessageType<any>[] = [
  Enum_Speed,
  Enum_Size,
  Enum_SpeedBigInt,
  Enum_SizeBigInt,
  JsonNames_Speed,
  JsonNames_Size,
  JsonNames_SpeedBigInt,
  JsonNames_SizeBigInt,
  Message_Speed,
  Message_Size,
  Message_SpeedBigInt,
  Message_SizeBigInt,
  OneofMessage_Speed,
  OneofMessage_Size,
  OneofMessage_SpeedBigInt,
  OneofMessage_SizeBigInt,
  OneofScalar_Speed,
  OneofScalar_Size,
  OneofScalar_SpeedBigInt,
  OneofScalar_SizeBigInt,
  Proto2_Speed,
  Proto2_Size,
  Proto2_SpeedBigInt,
  Proto2_SizeBigInt,
  Proto3_Speed,
  Proto3_Size,
  Proto3_SpeedBigInt,
  Proto3_SizeBigInt,
  RepeatedScalar_Speed,
  RepeatedScalar_Size,
  RepeatedScalar_SpeedBigInt,
  RepeatedScalar_SizeBigInt,
  Scalar_Speed,
  Scalar_Size,
  Scalar_SpeedBigInt,
  Scalar_SizeBigInt,
];

describe("generated code compatibility", () => {
  beforeEach(function () {
    jasmine.addCustomEqualityTester((a, b) =>
      a instanceof Uint8Array && b instanceof Uint8Array
        ? a.byteLength === b.byteLength
        : undefined
    );
  });

  describe("generated create()", function () {
    for (const generatedType of generatedRegistry) {
      it(`should have same result as reflection for ${generatedType.typeName}`, function () {
        const reflectionType = new MessageType(
          generatedType.typeName,
          generatedType.fields
        );
        let reflectionMsg = reflectionType.create();
        let generatedMsg = generatedType.create();
        expect(generatedMsg).toEqual(reflectionMsg);
      });
    }
  });
});
