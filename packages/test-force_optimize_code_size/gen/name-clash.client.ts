// @generated by protobuf-ts 2.9.6 with parameter force_optimize_code_size
// @generated from protobuf file "name-clash.proto" (package "spec", syntax proto3)
// tslint:disable
import type { RpcTransport } from "@protobuf-ts/runtime-rpc";
import type { ServiceInfo } from "@protobuf-ts/runtime-rpc";
import { NameClashService } from "./name-clash";
import { stackIntercept } from "@protobuf-ts/runtime-rpc";
import type { Error } from "./name-clash";
import type { UnaryCall } from "@protobuf-ts/runtime-rpc";
import type { RpcOptions } from "@protobuf-ts/runtime-rpc";
/**
 * method names that class with reserved property names
 *
 * @generated from protobuf service spec.NameClashService
 */
export interface INameClashServiceClient {
    /**
     * @generated from protobuf rpc: __proto__(spec.Error) returns (spec.Error);
     */
    Proto(input: Error, options?: RpcOptions): UnaryCall<Error, Error>;
    /**
     * @generated from protobuf rpc: toString(spec.Error) returns (spec.Error);
     */
    toString$(input: Error, options?: RpcOptions): UnaryCall<Error, Error>;
    /**
     * @generated from protobuf rpc: name(spec.Error) returns (spec.Error);
     */
    name$(input: Error, options?: RpcOptions): UnaryCall<Error, Error>;
    /**
     * @generated from protobuf rpc: constructor(spec.Error) returns (spec.Error);
     */
    constructor$(input: Error, options?: RpcOptions): UnaryCall<Error, Error>;
    /**
     * @generated from protobuf rpc: methods(spec.Error) returns (spec.Error);
     */
    methods$(input: Error, options?: RpcOptions): UnaryCall<Error, Error>;
    /**
     * @generated from protobuf rpc: typeName(spec.Error) returns (spec.Error);
     */
    typeName$(input: Error, options?: RpcOptions): UnaryCall<Error, Error>;
    /**
     * @generated from protobuf rpc: options(spec.Error) returns (spec.Error);
     */
    options$(input: Error, options?: RpcOptions): UnaryCall<Error, Error>;
    /**
     * @generated from protobuf rpc: _transport(spec.Error) returns (spec.Error);
     */
    Transport(input: Error, options?: RpcOptions): UnaryCall<Error, Error>;
}
/**
 * method names that class with reserved property names
 *
 * @generated from protobuf service spec.NameClashService
 */
export class NameClashServiceClient implements INameClashServiceClient, ServiceInfo {
    typeName = NameClashService.typeName;
    methods = NameClashService.methods;
    options = NameClashService.options;
    constructor(private readonly _transport: RpcTransport) {
    }
    /**
     * @generated from protobuf rpc: __proto__(spec.Error) returns (spec.Error);
     */
    Proto(input: Error, options?: RpcOptions): UnaryCall<Error, Error> {
        const method = this.methods[0], opt = this._transport.mergeOptions(options);
        return stackIntercept<Error, Error>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: toString(spec.Error) returns (spec.Error);
     */
    toString$(input: Error, options?: RpcOptions): UnaryCall<Error, Error> {
        const method = this.methods[1], opt = this._transport.mergeOptions(options);
        return stackIntercept<Error, Error>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: name(spec.Error) returns (spec.Error);
     */
    name$(input: Error, options?: RpcOptions): UnaryCall<Error, Error> {
        const method = this.methods[2], opt = this._transport.mergeOptions(options);
        return stackIntercept<Error, Error>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: constructor(spec.Error) returns (spec.Error);
     */
    constructor$(input: Error, options?: RpcOptions): UnaryCall<Error, Error> {
        const method = this.methods[3], opt = this._transport.mergeOptions(options);
        return stackIntercept<Error, Error>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: methods(spec.Error) returns (spec.Error);
     */
    methods$(input: Error, options?: RpcOptions): UnaryCall<Error, Error> {
        const method = this.methods[4], opt = this._transport.mergeOptions(options);
        return stackIntercept<Error, Error>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: typeName(spec.Error) returns (spec.Error);
     */
    typeName$(input: Error, options?: RpcOptions): UnaryCall<Error, Error> {
        const method = this.methods[5], opt = this._transport.mergeOptions(options);
        return stackIntercept<Error, Error>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: options(spec.Error) returns (spec.Error);
     */
    options$(input: Error, options?: RpcOptions): UnaryCall<Error, Error> {
        const method = this.methods[6], opt = this._transport.mergeOptions(options);
        return stackIntercept<Error, Error>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: _transport(spec.Error) returns (spec.Error);
     */
    Transport(input: Error, options?: RpcOptions): UnaryCall<Error, Error> {
        const method = this.methods[7], opt = this._transport.mergeOptions(options);
        return stackIntercept<Error, Error>("unary", this._transport, method, opt, input);
    }
}
