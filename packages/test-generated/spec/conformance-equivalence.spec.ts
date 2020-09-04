import {TestAllTypesProto3} from "../ts-out/google/protobuf/test_messages_proto3";
import {TestAllTypesProto2} from "../ts-out/google/protobuf/test_messages_proto2";
import {JsonValue} from "@protobuf-ts/runtime";


describe('conformance-equivalence', function () {


    /**
     * This conformance test fails because we write fields in a different order.
     *
     * ERROR,
     * test=Recommended.Proto3.ProtobufInput.ValidDataOneofBinary.MESSAGE.Merge.ProtobufOutput:
     * Output was not equivalent to reference message:
     *   Expect: \202\007\014\022\012\010\001\020\001\310\005\001\310\005\001,
     *   but got: \202\007\013\022\011\010\001\020\001\312\005\002\001\001.
     * request=protobuf_payload: "\202\007\t\022\007\010\001\020\001\310\005\001\202\007\007\022\005\020\001\310\005\001"
     * requested_output_format: PROTOBUF
     * message_type: "protobuf_test_messages.proto3.TestAllTypesProto3"
     * test_category: BINARY_TEST,
     * response=protobuf_payload: "\202\007\013\022\t\010\001\020\001\312\005\002\001\001"
     */
    it('Recommended.Proto3.ProtobufInput.ValidDataOneofBinary.MESSAGE.Merge.ProtobufOutput', function () {

        // conformance request protobuf payload
        let protobuf_payload_octal_str = "\\202\\007\\t\\022\\007\\010\\001\\020\\001\\310\\005\\001\\202\\007\\007\\022\\005\\020\\001\\310\\005\\001";
        let protobuf_payload = new Uint8Array(protobuf_payload_octal_str.split("\\").filter(s => s.length > 0).map(s => {
            if (s === "t") {
                // \t is byte 0x09 in ASCII encoding
                return 0x09;
            }
            return parseInt(s, 8);
        }));

        // conformance request expected reference message (as JSON)
        // obtained manually from binary_json_conformance_suite.cc and test
        // Required.Proto3.ProtobufInput.ValidDataOneof.MESSAGE.Merge.JsonOutput
        let reference_message_json: JsonValue = {
            "oneofNestedMessage": {
                "corecursive": {
                    "optionalInt32": 1,
                    "optionalInt64": "1",
                    "unpackedInt32": [
                        1,
                        1
                    ]
                }
            }
        };

        let reference_message = TestAllTypesProto3.fromJson(reference_message_json);
        let request_message = TestAllTypesProto3.fromBinary(protobuf_payload);
        expect(request_message).toEqual(reference_message);
    });


    /**
     * This conformance test fails because we write fields in a different order.
     *
     * ERROR,
     * test=Recommended.Proto2.ProtobufInput.ValidDataOneofBinary.MESSAGE.Merge.ProtobufOutput:
     * Output was not equivalent to reference message:
     *   Expect: \202\007\014\022\012\010\001\020\001\310\005\001\310\005\001,
     *   but got: \202\007\013\022\011\010\001\020\001\312\005\002\001\001.
     * request=protobuf_payload: "\202\007\t\022\007\010\001\020\001\310\005\001\202\007\007\022\005\020\001\310\005\001"
     * requested_output_format: PROTOBUF
     * message_type: "protobuf_test_messages.proto2.TestAllTypesProto2"
     * test_category: BINARY_TEST,
     * response=protobuf_payload: "\202\007\013\022\t\010\001\020\001\312\005\002\001\001"
     */
    it('Recommended.Proto2.ProtobufInput.ValidDataOneofBinary.MESSAGE.Merge.ProtobufOutput', function () {

        // conformance request protobuf payload
        let protobuf_payload_octal_str = "\\202\\007\\t\\022\\007\\010\\001\\020\\001\\310\\005\\001\\202\\007\\007\\022\\005\\020\\001\\310\\005\\001";
        let protobuf_payload = new Uint8Array(protobuf_payload_octal_str.split("\\").filter(s => s.length > 0).map(s => {
            if (s === "t") {
                // \t is byte 0x09 in ASCII encoding
                return 0x09;
            }
            return parseInt(s, 8);
        }));

        // conformance request expected reference message (as JSON)
        // obtained manually from binary_json_conformance_suite.cc and test
        // Required.Proto3.ProtobufInput.ValidDataOneof.MESSAGE.Merge.JsonOutput
        let reference_message_json: JsonValue = {
            "oneofNestedMessage": {
                "corecursive": {
                    "optionalInt32": 1,
                    "optionalInt64": "1",
                    "unpackedInt32": [
                        1,
                        1
                    ]
                }
            }
        };

        let reference_message = TestAllTypesProto2.fromJson(reference_message_json);
        let request_message = TestAllTypesProto2.fromBinary(protobuf_payload);
        expect(request_message).toEqual(reference_message);
    });


});
