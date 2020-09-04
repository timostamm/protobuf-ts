import {InjectionToken} from "@angular/core";
import {RpcTransport} from "@protobuf-ts/runtime-rpc";


export const RPC_TRANSPORT = new InjectionToken<RpcTransport>('RpcTransport');

