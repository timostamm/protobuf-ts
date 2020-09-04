import {IMessageType, JsonValue} from "@protobuf-ts/runtime";

/**
 * Describes a protobuf service for runtime reflection.
 */
export interface ServiceInfo {

    /**
     * The protobuf type name of the service, including package name if
     * present.
     *
     * If the .proto file included a `package` statement, the type name
     * starts with '.'.
     */
    readonly typeName: string;

    /**
     * Information for each rpc method of the service, in the order of
     * declaration in the source .proto.
     */
    readonly methods: MethodInfo[];
}

/**
 * Describes a protobuf service method for runtime reflection.
 */
export interface MethodInfo<I extends object = any, O extends object = any> {

    /**
     * The service this method belongs to.
     */
    readonly service: ServiceInfo

    /**
     * The name of the method as declared in .proto
     */
    readonly name: string;

    /**
     * The name of the method as used in generated code.
     * May be omitted if it would be equal to `name`.
     */
    readonly localName?: string;

    /**
     * The idempotency level as specified in .proto.
     *
     * For example, the following method declaration will set
     * `idempotency` to 'NO_SIDE_EFFECTS'.
     *
     * ```proto
     * rpc Foo (FooRequest) returns (FooResponse) {
     *   option idempotency_level = NO_SIDE_EFFECTS
     * }
     * ```
     *
     * See `google/protobuf/descriptor.proto`, `MethodOptions`.
     */
    readonly idempotency?: undefined | 'NO_SIDE_EFFECTS' | 'IDEMPOTENT';

    /**
     * Was the rpc declared with server streaming?
     *
     * Example declaration:
     *
     * ```proto
     * rpc Foo (FooRequest) returns (stream FooResponse);
     * ```
     */
    readonly serverStreaming?: boolean;

    /**
     * Was the rpc declared with server streaming?
     *
     * Example declaration:
     *
     * ```proto
     * rpc Foo (stream FooRequest) returns (FooResponse);
     * ```
     */
    readonly clientStreaming?: boolean;

    /**
     * The generated type handler for the input message.
     * Provides methods to encode / decode binary or JSON format.
     */
    readonly I: IMessageType<I>;

    /**
     * The generated type handler for the output message.
     * Provides methods to encode / decode binary or JSON format.
     */
    readonly O: IMessageType<O>;

    /**
     * Contains custom method options from the .proto source.
     */
    options?: { [extensionName: string]: JsonValue };


}


/**
 * Read custom method options from a generated service client.
 */
export function readMethodOptions<T extends object>(service: ServiceInfo, methodName: string | number, extensionName: string, extensionType: IMessageType<T>): T | undefined {
    let info = service.methods.find((m, i) => m.localName === methodName || i === methodName);
    return info && info.options && info.options[extensionName]
        ? extensionType.fromJson(info.options[extensionName])
        : undefined;
}
