// @generated by protobuf-ts 2.9.5 with parameter force_optimize_code_size,long_type_string
// @generated from protobuf file "service-clash.proto" (package "spec", syntax proto3)
// tslint:disable
//
// This file should generate to service-clash.ts *and* service-clash.client.ts.
// Because the latter is already taken by a proto file, the client file should
// be written under a different name.
//
import type { RpcTransport } from "@protobuf-ts/runtime-rpc";
import type { ServiceInfo } from "@protobuf-ts/runtime-rpc";
import { ClashService } from "./service-clash";
/**
 * @generated from protobuf service spec.ClashService
 */
export interface IClashServiceClient {
}
/**
 * @generated from protobuf service spec.ClashService
 */
export class ClashServiceClient implements IClashServiceClient, ServiceInfo {
    typeName = ClashService.typeName;
    methods = ClashService.methods;
    options = ClashService.options;
    constructor(private readonly _transport: RpcTransport) {
    }
}
