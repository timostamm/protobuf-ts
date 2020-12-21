import {IMessageType, JsonValue, lowerCamelCase} from "@protobuf-ts/runtime";

/**
 * Describes a protobuf service for runtime reflection.
 */
export interface ServiceInfo {

    /**
     * The protobuf type name of the service, including package name if
     * present.
     */
    readonly typeName: string;

    /**
     * Information for each rpc method of the service, in the order of
     * declaration in the source .proto.
     */
    readonly methods: MethodInfo[];

    /**
     * Contains custom service options from the .proto source in JSON format.
     */
    readonly options: { [extensionName: string]: JsonValue };
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
     * The name of the method in the runtime.
     */
    readonly localName: string;

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
    readonly idempotency: undefined | 'NO_SIDE_EFFECTS' | 'IDEMPOTENT';

    /**
     * Was the rpc declared with server streaming?
     *
     * Example declaration:
     *
     * ```proto
     * rpc Foo (FooRequest) returns (stream FooResponse);
     * ```
     */
    readonly serverStreaming: boolean;

    /**
     * Was the rpc declared with client streaming?
     *
     * Example declaration:
     *
     * ```proto
     * rpc Foo (stream FooRequest) returns (FooResponse);
     * ```
     */
    readonly clientStreaming: boolean;

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
     * Contains custom method options from the .proto source in JSON format.
     */
    readonly options: { [extensionName: string]: JsonValue };

}


/**
 * Version of `MethodInfo` that does not include "service", and also allows
 * the following properties to be omitted:
 * - "localName": can be omitted if equal to lowerCamelCase(name)
 * - "serverStreaming": omitting means `false`
 * - "clientStreaming": omitting means `false`
 * - "options"
 */
export type PartialMethodInfo<I extends object = any, O extends object = any> =
    PartialPartial<Omit<MethodInfo<I, O>, "service">, "localName" | "idempotency" | "serverStreaming" | "clientStreaming" | "options">;


// Make all properties in T optional, except those whose keys are in the union K.
type PartialPartial<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>;


/**
 * The available client styles from @protobuf-ts/plugin
 * The extensions are declared in protobuf-ts.proto
 */
export enum ClientStyle {

    /**
     * Do not emit a client for this service.
     */
    NONE = 0,

    /**
     * Use the call implementations of @protobuf-ts/runtime-rpc.
     * This is the default behaviour.
     */
    CALL = 1,

    /**
     * Use promises as return type.
     * This style can only be used for unary methods (no server or client
     * streaming).
     */
    PROMISE = 2,

    /**
     * Use Observables from the "rxjs" package for requests and responses.
     */
    RX = 3
}


/**
 * The available server styles from @protobuf-ts/plugin
 * The extensions are declared in protobuf-ts.proto
 */
export enum ServerStyle {

    /**
     * Do not emit a server for this service.
     * This is the default behaviour.
     */
    NONE = 0,

    /**
     * Generate a server for @grpc/grpc-js
     */
    GRPC = 1,
}


/**
 * Turns PartialMethodInfo into MethodInfo.
 */
export function normalizeMethodInfo<I extends object = any, O extends object = any>(method: PartialMethodInfo<I, O>, service: ServiceInfo): MethodInfo<I, O> {
    let m = method as any;
    m.service = service;
    m.localName = m.localName ?? lowerCamelCase(m.name);
    // noinspection PointlessBooleanExpressionJS
    m.serverStreaming = !!m.serverStreaming;
    // noinspection PointlessBooleanExpressionJS
    m.clientStreaming = !!m.clientStreaming;
    m.options = m.options ?? {};
    m.idempotency = m.idempotency ?? undefined;
    return m as MethodInfo<I, O>;
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
