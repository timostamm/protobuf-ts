import {ScalarType} from "@bufbuild/protobuf";
import {WireType} from "@bufbuild/protobuf/wire";

export function wireTypeFromScalar(type: ScalarType): WireType {
    switch (type) {
        case ScalarType.BYTES:
        case ScalarType.STRING:
            return WireType.LengthDelimited;
        case ScalarType.DOUBLE:
        case ScalarType.FIXED64:
        case ScalarType.SFIXED64:
            return WireType.Bit64;
        case ScalarType.FIXED32:
        case ScalarType.SFIXED32:
        case ScalarType.FLOAT:
            return WireType.Bit32;
        default:
            return WireType.Varint;
    }
}
