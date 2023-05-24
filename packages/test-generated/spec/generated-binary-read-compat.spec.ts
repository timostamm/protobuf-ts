import { IMessageType, MessageType } from "@protobuf-ts/runtime";
import { EnumFieldMessage as EnumFieldMessage_Speed } from "../ts-out/speed/msg-enum";
import { EnumFieldMessage as EnumFieldMessage_Size } from "../ts-out/size/msg-enum";
import { EnumFieldMessage as EnumFieldMessage_SpeedBigInt } from "../ts-out/speed-bigint/msg-enum";
import { EnumFieldMessage as EnumFieldMessage_SizeBigInt } from "../ts-out/size-bigint/msg-enum";
import { JsonNamesMessage as JsonNamesMessage_Speed } from "../ts-out/speed/msg-json-names";
import { JsonNamesMessage as JsonNamesMessage_Size } from "../ts-out/size/msg-json-names";
import { JsonNamesMessage as JsonNamesMessage_SpeedBigInt } from "../ts-out/speed-bigint/msg-json-names";
import { JsonNamesMessage as JsonNamesMessage_SizeBigInt } from "../ts-out/size-bigint/msg-json-names";
import { MessageFieldMessage as MessageFieldMessage_Speed } from "../ts-out/speed/msg-message";
import { MessageFieldMessage as MessageFieldMessage_Size } from "../ts-out/size/msg-message";
import { MessageFieldMessage as MessageFieldMessage_SpeedBigInt } from "../ts-out/speed-bigint/msg-message";
import { MessageFieldMessage as MessageFieldMessage_SizeBigInt } from "../ts-out/size-bigint/msg-message";
import {
  OneofMessageMemberMessage as OneofMessageMemberMessage_Speed,
  OneofScalarMemberMessage as OneofScalarMemberMessage_Speed,
} from "../ts-out/speed/msg-oneofs";
import {
  OneofMessageMemberMessage as OneofMessageMemberMessage_Size,
  OneofScalarMemberMessage as OneofScalarMemberMessage_Size,
} from "../ts-out/size/msg-oneofs";
import {
  OneofMessageMemberMessage as OneofMessageMemberMessage_SpeedBigInt,
  OneofScalarMemberMessage as OneofScalarMemberMessage_SpeedBigInt,
} from "../ts-out/speed-bigint/msg-oneofs";
import {
  OneofMessageMemberMessage as OneofMessageMemberMessage_SizeBigInt,
  OneofScalarMemberMessage as OneofScalarMemberMessage_SizeBigInt,
} from "../ts-out/size-bigint/msg-oneofs";
import { Proto2OptionalsMessage as Proto2OptionalsMessage_Speed } from "../ts-out/speed/msg-proto2-optionals";
import { Proto2OptionalsMessage as Proto2OptionalsMessage_Size } from "../ts-out/size/msg-proto2-optionals";
import { Proto2OptionalsMessage as Proto2OptionalsMessage_SpeedBigInt } from "../ts-out/speed-bigint/msg-proto2-optionals";
import { Proto2OptionalsMessage as Proto2OptionalsMessage_SizeBigInt } from "../ts-out/size-bigint/msg-proto2-optionals";
import { Proto3OptionalsMessage as Proto3OptionalsMessage_Speed } from "../ts-out/speed/msg-proto3-optionals";
import { Proto3OptionalsMessage as Proto3OptionalsMessage_Size } from "../ts-out/size/msg-proto3-optionals";
import { Proto3OptionalsMessage as Proto3OptionalsMessage_SpeedBigInt } from "../ts-out/speed-bigint/msg-proto3-optionals";
import { Proto3OptionalsMessage as Proto3OptionalsMessage_SizeBigInt } from "../ts-out/size-bigint/msg-proto3-optionals";
import {
  RepeatedScalarValuesMessage as RepeatedScalarValuesMessage_Speed,
  ScalarValuesMessage as ScalarValuesMessage_Speed,
} from "../ts-out/speed/msg-scalar";
import {
  RepeatedScalarValuesMessage as RepeatedScalarValuesMessage_Size,
  ScalarValuesMessage as ScalarValuesMessage_Size,
} from "../ts-out/size/msg-scalar";
import {
  RepeatedScalarValuesMessage as RepeatedScalarValuesMessage_SpeedBigInt,
  ScalarValuesMessage as ScalarValuesMessage_SpeedBigInt,
} from "../ts-out/speed-bigint/msg-scalar";
import {
  RepeatedScalarValuesMessage as RepeatedScalarValuesMessage_SizeBigInt,
  ScalarValuesMessage as ScalarValuesMessage_SizeBigInt,
} from "../ts-out/size-bigint/msg-scalar";

const msgs: { [s: string]: IMessageType<any>[] } = {
  speed: [
    ScalarValuesMessage_Speed,
    EnumFieldMessage_Speed,
    JsonNamesMessage_Speed,
    MessageFieldMessage_Speed,
    OneofMessageMemberMessage_Speed,
    OneofScalarMemberMessage_Speed,
    Proto2OptionalsMessage_Speed,
    Proto3OptionalsMessage_Speed,
    RepeatedScalarValuesMessage_Speed,
    ScalarValuesMessage_Speed,
  ],
  size: [
    ScalarValuesMessage_Size,
    EnumFieldMessage_Size,
    JsonNamesMessage_Size,
    MessageFieldMessage_Size,
    OneofMessageMemberMessage_Size,
    OneofScalarMemberMessage_Size,
    Proto2OptionalsMessage_Size,
    Proto3OptionalsMessage_Size,
    RepeatedScalarValuesMessage_Size,
    ScalarValuesMessage_Size,
  ],
  speedBigInt: [
    ScalarValuesMessage_SpeedBigInt,
    EnumFieldMessage_SpeedBigInt,
    JsonNamesMessage_SpeedBigInt,
    MessageFieldMessage_SpeedBigInt,
    OneofMessageMemberMessage_SpeedBigInt,
    OneofScalarMemberMessage_SpeedBigInt,
    Proto2OptionalsMessage_SpeedBigInt,
    Proto3OptionalsMessage_SpeedBigInt,
    RepeatedScalarValuesMessage_SpeedBigInt,
    ScalarValuesMessage_SpeedBigInt,
  ],
  sizeBigInt: [
    ScalarValuesMessage_SizeBigInt,
    EnumFieldMessage_SizeBigInt,
    JsonNamesMessage_SizeBigInt,
    MessageFieldMessage_SizeBigInt,
    OneofMessageMemberMessage_SizeBigInt,
    OneofScalarMemberMessage_SizeBigInt,
    Proto2OptionalsMessage_SizeBigInt,
    Proto3OptionalsMessage_SizeBigInt,
    RepeatedScalarValuesMessage_SizeBigInt,
    ScalarValuesMessage_SizeBigInt,
  ],
};

Object.entries(msgs).forEach(([name, types]) => {
  types.forEach((generatedType) => {
    describe("generated code compatibility " + name, () => {
      beforeEach(function () {
        jasmine.addCustomEqualityTester((a, b) =>
          a instanceof Uint8Array && b instanceof Uint8Array
            ? a.byteLength === b.byteLength
            : undefined
        );
      });

      describe("generated create()", function () {
        it(`should have same result as reflection for ${generatedType.typeName}`, function () {
          const reflectionType = new MessageType(
            generatedType.typeName,
            generatedType.fields
          );
          let reflectionMsg = reflectionType.create();
          let generatedMsg = generatedType.create();
          expect(generatedMsg).toEqual(reflectionMsg);
        });
      });
    });
  });
});
