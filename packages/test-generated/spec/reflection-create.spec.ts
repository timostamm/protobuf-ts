import type { IMessageType } from "@protobuf-ts/runtime";
import { reflectionCreate } from "@protobuf-ts/runtime";
import { EnumFieldMessage as EnumFieldMessage_Speed } from "../ts-out/speed/msg-enum";
import { EnumFieldMessage as EnumFieldMessage_Size } from "../ts-out/size/msg-enum";
import { EnumFieldMessage as EnumFieldMessage_SpeedBigInt } from "../ts-out/speed-bigint/msg-enum";
import { EnumFieldMessage as EnumFieldMessage_SizeBigInt } from "../ts-out/size-bigint/msg-enum";
import {
  MessageMapMessage as MessageMapMessage_Speed,
  ScalarMapsMessage as ScalarMapsMessage_Speed,
} from "../ts-out/speed/msg-maps";
import {
  MessageMapMessage as MessageMapMessage_Size,
  ScalarMapsMessage as ScalarMapsMessage_Size,
} from "../ts-out/size/msg-maps";
import {
  MessageMapMessage as MessageMapMessage_SpeedBigInt,
  ScalarMapsMessage as ScalarMapsMessage_SpeedBigInt,
} from "../ts-out/speed-bigint/msg-maps";
import {
  MessageMapMessage as MessageMapMessage_SizeBigInt,
  ScalarMapsMessage as ScalarMapsMessage_SizeBigInt,
} from "../ts-out/size-bigint/msg-maps";
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
import { TestAllTypesProto3 as TestAllTypesProto3_Speed } from "../ts-out/speed/google/protobuf/test_messages_proto3";
import { TestAllTypesProto3 as TestAllTypesProto3_Size } from "../ts-out/size/google/protobuf/test_messages_proto3";
import { TestAllTypesProto3 as TestAllTypesProto3_SpeedBigInt } from "../ts-out/speed-bigint/google/protobuf/test_messages_proto3";
import { TestAllTypesProto3 as TestAllTypesProto3_SizeBigInt } from "../ts-out/size-bigint/google/protobuf/test_messages_proto3";
import { TestAllTypesProto2 as TestAllTypesProto2_Speed } from "../ts-out/speed/google/protobuf/test_messages_proto2";
import { TestAllTypesProto2 as TestAllTypesProto2_Size } from "../ts-out/size/google/protobuf/test_messages_proto2";
import { TestAllTypesProto2 as TestAllTypesProto2_SpeedBigInt } from "../ts-out/speed-bigint/google/protobuf/test_messages_proto2";
import { TestAllTypesProto2 as TestAllTypesProto2_SizeBigInt } from "../ts-out/size-bigint/google/protobuf/test_messages_proto2";

interface MessageMap {
  speed: {
    enumFieldMessage: IMessageType<EnumFieldMessage_Speed>;
    scalarMapsMessage: IMessageType<ScalarMapsMessage_Speed>;
    messageMapMessage: IMessageType<MessageMapMessage_Speed>;
    oneofScalarMemberMessage: IMessageType<OneofScalarMemberMessage_Speed>;
    oneofMessageMemberMessage: IMessageType<OneofMessageMemberMessage_Speed>;
    testAllTypesProto3: IMessageType<TestAllTypesProto3_Speed>;
    testAllTypesProto2: IMessageType<TestAllTypesProto2_Speed>;
  };
  size: {
    enumFieldMessage: IMessageType<EnumFieldMessage_Size>;
    scalarMapsMessage: IMessageType<ScalarMapsMessage_Size>;
    messageMapMessage: IMessageType<MessageMapMessage_Size>;
    oneofScalarMemberMessage: IMessageType<OneofScalarMemberMessage_Size>;
    oneofMessageMemberMessage: IMessageType<OneofMessageMemberMessage_Size>;
    testAllTypesProto3: IMessageType<TestAllTypesProto3_Size>;
    testAllTypesProto2: IMessageType<TestAllTypesProto2_Size>;
  };
  speedBigInt: {
    enumFieldMessage: IMessageType<EnumFieldMessage_SpeedBigInt>;
    scalarMapsMessage: IMessageType<ScalarMapsMessage_SpeedBigInt>;
    messageMapMessage: IMessageType<MessageMapMessage_SpeedBigInt>;
    oneofScalarMemberMessage: IMessageType<OneofScalarMemberMessage_SpeedBigInt>;
    oneofMessageMemberMessage: IMessageType<OneofMessageMemberMessage_SpeedBigInt>;
    testAllTypesProto3: IMessageType<TestAllTypesProto3_SpeedBigInt>;
    testAllTypesProto2: IMessageType<TestAllTypesProto2_SpeedBigInt>;
  };
  sizeBigInt: {
    enumFieldMessage: IMessageType<EnumFieldMessage_SizeBigInt>;
    scalarMapsMessage: IMessageType<ScalarMapsMessage_SizeBigInt>;
    messageMapMessage: IMessageType<MessageMapMessage_SizeBigInt>;
    oneofScalarMemberMessage: IMessageType<OneofScalarMemberMessage_SizeBigInt>;
    oneofMessageMemberMessage: IMessageType<OneofMessageMemberMessage_SizeBigInt>;
    testAllTypesProto3: IMessageType<TestAllTypesProto3_SizeBigInt>;
    testAllTypesProto2: IMessageType<TestAllTypesProto2_SizeBigInt>;
  };
}

const msgs: MessageMap = {
  speed: {
    enumFieldMessage: EnumFieldMessage_Speed,
    scalarMapsMessage: ScalarMapsMessage_Speed,
    messageMapMessage: MessageMapMessage_Speed,
    oneofScalarMemberMessage: OneofScalarMemberMessage_Speed,
    oneofMessageMemberMessage: OneofMessageMemberMessage_Speed,
    testAllTypesProto3: TestAllTypesProto3_Speed,
    testAllTypesProto2: TestAllTypesProto2_Speed,
  },
  size: {
    enumFieldMessage: EnumFieldMessage_Size,
    scalarMapsMessage: ScalarMapsMessage_Size,
    messageMapMessage: MessageMapMessage_Size,
    oneofScalarMemberMessage: OneofScalarMemberMessage_Size,
    oneofMessageMemberMessage: OneofMessageMemberMessage_Size,
    testAllTypesProto3: TestAllTypesProto3_Size,
    testAllTypesProto2: TestAllTypesProto2_Size,
  },
  speedBigInt: {
    enumFieldMessage: EnumFieldMessage_SpeedBigInt,
    scalarMapsMessage: ScalarMapsMessage_SpeedBigInt,
    messageMapMessage: MessageMapMessage_SpeedBigInt,
    oneofScalarMemberMessage: OneofScalarMemberMessage_SpeedBigInt,
    oneofMessageMemberMessage: OneofMessageMemberMessage_SpeedBigInt,
    testAllTypesProto3: TestAllTypesProto3_SpeedBigInt,
    testAllTypesProto2: TestAllTypesProto2_SpeedBigInt,
  },
  sizeBigInt: {
    enumFieldMessage: EnumFieldMessage_SizeBigInt,
    scalarMapsMessage: ScalarMapsMessage_SizeBigInt,
    messageMapMessage: MessageMapMessage_SizeBigInt,
    oneofScalarMemberMessage: OneofScalarMemberMessage_SizeBigInt,
    oneofMessageMemberMessage: OneofMessageMemberMessage_SizeBigInt,
    testAllTypesProto3: TestAllTypesProto3_SizeBigInt,
    testAllTypesProto2: TestAllTypesProto2_SizeBigInt,
  },
};

Object.entries(msgs).forEach(
  ([
    name,
    {
      enumFieldMessage,
      scalarMapsMessage,
      messageMapMessage,
      oneofScalarMemberMessage,
      oneofMessageMemberMessage,
      testAllTypesProto3,
      testAllTypesProto2,
    },
  ]) => {
    describe("reflectionCreate() " + name, function () {
      // const types: IIMessageType<any>[] = [
      //   EnumFieldMessage,
      //   ScalarMapsMessage,
      //   MessageMapMessage,
      //   OneofScalarMemberMessage,
      //   OneofMessageMemberMessage,
      //   TestAllTypesProto3,
      //   TestAllTypesProto2,
      // ];
      // for (const type of types) {
      // describe(`with message type ${type.typeName}`, () => {
      //   it("creates the same object as create()", function () {
      //     const message = reflectionCreate(type);
      //     expect(message).toEqual(type.create());
      //   });
      // });
      // }

      describe(testAllTypesProto3.typeName, function () {
        it("creates expected object", function () {
          const message = reflectionCreate(testAllTypesProto3);
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
          expect(message.oneofField).toEqual({ oneofKind: undefined });
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
  }
);
