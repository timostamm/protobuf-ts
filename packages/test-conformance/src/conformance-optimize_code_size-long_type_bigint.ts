#!/usr/bin/env npx tsx

import {runTests} from "./conformance";
import {TestAllTypesProto3} from "./gen/optimize_code_size-long_type_bigint/google/protobuf/test_messages_proto3";
import {TestAllTypesProto2} from "./gen/optimize_code_size-long_type_bigint/google/protobuf/test_messages_proto2";
import {Struct, Value} from "./gen/optimize_code_size-long_type_bigint/google/protobuf/struct";
import {FieldMask} from "./gen/optimize_code_size-long_type_bigint/google/protobuf/field_mask";
import {Timestamp} from "./gen/optimize_code_size-long_type_bigint/google/protobuf/timestamp";
import {Duration} from "./gen/optimize_code_size-long_type_bigint/google/protobuf/duration";
import {Int32Value} from "./gen/optimize_code_size-long_type_bigint/google/protobuf/wrappers";
import {Any} from "./gen/optimize_code_size-long_type_bigint/google/protobuf/any";

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
