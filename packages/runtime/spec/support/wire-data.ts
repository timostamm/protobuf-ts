export const WireDataDelimited = {

    // a fixed-length 32 bit integer, prepended by length
    fixed32_666: new Uint8Array([4, 154, 2, 0, 0]),

}


export const WireDataPlain = {

    // Single unsigned, variable length 32 bit integer: 32
    uint32_32: new Uint8Array([32]),

    // a tag for field no 4 with wire type Varint
    tag_field_4_wire_type_varint: new Uint8Array([32]),

    // Single boolean: true
    bool_true: new Uint8Array([1]),

    // Single boolean: false
    bool_false: new Uint8Array([0]),

    // Single fixed-length 64 bit integer: 123
    fixed64_123: new Uint8Array([123, 0, 0, 0, 0, 0, 0, 0]),

    // Single signed, fixed-length 64 bit integer: 123
    sfixed64_123: new Uint8Array([123, 0, 0, 0, 0, 0, 0, 0]),

    // Single signed, fixed-length 64 bit integer: -123
    sfixed64_minus_123: new Uint8Array([133, 255, 255, 255, 255, 255, 255, 255]),

    // Single signed, variable-length 64 bit integer: 123
    int64_123: new Uint8Array([123]),

    // Single signed, variable-length 64 bit integer: -123
    int64_minus_123: new Uint8Array([133, 255, 255, 255, 255, 255, 255, 255, 255, 1]),

    // Single unsigned, variable-length 64 bit integer: 123
    uint64_123: new Uint8Array([123]),

    // Single signed, variable-length 64 bit integer: 123
    sint64_123: new Uint8Array([246, 1]),

    // Single signed, variable-length 64 bit integer: -123
    sint64_minus_123: new Uint8Array([245, 1]),

    // Single signed, variable-length 32 bit integer: 123
    int32_123: new Uint8Array([123]),

    // Single signed, variable-length 32 bit integer: -123
    int32_minus_123: new Uint8Array([133, 255, 255, 255, 255, 255, 255, 255, 255, 1]),

    // Single unsigned, variable-length 32 bit integer: 123
    uint32_123: new Uint8Array([123]),

    // Single 32 bit floating point: 0.75
    float_0_75: new Uint8Array([0, 0, 64, 63]),

    // Single 32 bit floating point: -0.75
    float_minus_0_75: new Uint8Array([0, 0, 64, 191]),

    // Single 64 bit floating point: 0.75
    double_0_75: new Uint8Array([0, 0, 0, 0, 0, 0, 232, 63]),

    // Single 64 bit floating point: -0.75
    double_minus_0_75: new Uint8Array([0, 0, 0, 0, 0, 0, 232, 191]),

    // Single unsigned, fixed-length 32 bit integer: 123
    fixed32_123: new Uint8Array([123, 0, 0, 0]),

    // Single signed, fixed-length 32 bit integer: 123
    sfixed32_123: new Uint8Array([123, 0, 0, 0]),

    // Single signed, fixed-length 32 bit integer: 123
    sfixed32_minus_123: new Uint8Array([133, 255, 255, 255]),

    // Single signed, variable-length 32 bit integer: 123
    sint32_123: new Uint8Array([246, 1]),

    // Single signed, variable-length 32 bit integer: -123
    sint32_minus_123: new Uint8Array([245, 1]),

    // UTF-8 encoded text: hello 🌍
    string_hello_world_emoji: new Uint8Array([10, 104, 101, 108, 108, 111, 32, 240, 159, 140, 141]),

    // bytes: de ad be ef
    bytes_deadbeef: new Uint8Array([4, 222, 173, 190, 239]),

}
