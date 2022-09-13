import {
    BinaryReadOptions,
    IBinaryReader,
    IBinaryWriter,
    IMessageType,
    JsonReadOptions,
    JsonValue,
    JsonWriteOptions,
    JsonWriteStringOptions,
    PartialMessage,
    ScalarType
} from "../../src";


export function scalarTypeToNameForTests(type: ScalarType): string {
    switch (type) {
        case ScalarType.DOUBLE:
            return 'double';
        case ScalarType.FLOAT:
            return 'float';
        case ScalarType.INT64:
            return 'int64';
        case ScalarType.UINT64:
            return 'uint64';
        case ScalarType.INT32:
            return 'int32';
        case ScalarType.FIXED64:
            return 'fixed64';
        case ScalarType.FIXED32:
            return 'fixed32';
        case ScalarType.BOOL:
            return 'bool';
        case ScalarType.STRING:
            return 'string';
        // case ScalarType.GROUP:
        //     break;
        // case ScalarType.MESSAGE:
        //     break;
        case ScalarType.BYTES:
            return 'bytes';
        case ScalarType.UINT32:
            return 'uint32';
        // case ScalarType.ENUM:
        //     break;
        case ScalarType.SFIXED32:
            return 'sfixed32';
        case ScalarType.SFIXED64:
            return 'sfixed64';
        case ScalarType.SINT32:
            return 'sint32';
        case ScalarType.SINT64:
            return 'sint64';
    }
}

export function stubMessageType(name = '.test.Message'): IMessageType<any> {
    return {
        typeName: name,
        fields: [],
        options: {},
        protoSyntax: "proto3",
        create(value?: any): any {
            throw new Error('just a stub');
        },
        mergePartial(target: any, source: PartialMessage<any>): any {
            throw new Error('just a stub');
        },
        isAssignable(arg: any): arg is any {
            throw new Error('just a stub');
        },
        equals(a: any, b: any): boolean {
            throw new Error('just a stub');
        },
        is(arg: any, depth?: number): arg is any {
            throw new Error('just a stub');
        },
        clone(message: any): any {
            throw new Error('just a stub');
        },
        internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target: any): any {
            throw new Error('just a stub');
        },
        internalJsonWrite(message: any, options: JsonWriteOptions): JsonValue {
            throw new Error('just a stub');
        },
        internalJsonRead(json: JsonValue, options: JsonReadOptions, target: any): any {
            throw new Error('just a stub');
        },
        internalBinaryWrite(msg: any, output: IBinaryWriter) {
            throw new Error('just a stub');
        },
        toBinary(msg: any): Uint8Array {
            throw new Error('just a stub');
        },
        toJson(msg: any, options?: Partial<JsonWriteOptions>): JsonValue {
            throw new Error('just a stub');
        },
        toJsonString(message: any, options?: Partial<JsonWriteStringOptions>): string {
            throw new Error('just a stub');
        },
        fromJsonString(json: string, options?: Partial<JsonReadOptions>): any {
            throw new Error('just a stub');
        },
        fromJson(json: JsonValue, options?: Partial<JsonReadOptions>): any {
            throw new Error('just a stub');
        },
        fromBinary(data: Uint8Array, options?: Partial<BinaryReadOptions>): any {
            throw new Error('just a stub');
        }
    }
}
