#!/usr/bin/env npx tsx

import {runTests} from "./conformance";
import {TestAllTypesProto3} from "./gen/optimize_code_size-long_type_string/google/protobuf/test_messages_proto3";
import {TestAllTypesProto2} from "./gen/optimize_code_size-long_type_string/google/protobuf/test_messages_proto2";
import {Struct, Value} from "./gen/optimize_code_size-long_type_string/google/protobuf/struct";
import {FieldMask} from "./gen/optimize_code_size-long_type_string/google/protobuf/field_mask";
import {Timestamp} from "./gen/optimize_code_size-long_type_string/google/protobuf/timestamp";
import {Duration} from "./gen/optimize_code_size-long_type_string/google/protobuf/duration";
import {Int32Value} from "./gen/optimize_code_size-long_type_string/google/protobuf/wrappers";
import {Any} from "./gen/optimize_code_size-long_type_string/google/protobuf/any";

runTests([
    Value,
    Struct,
    FieldMask,
    Timestamp,
    Duration,
    Int32Value,
    TestAllTypesProto3,
    TestAllTypesProto2,
    Any,
]);
