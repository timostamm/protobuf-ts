import {InjectionToken} from "@angular/core";
import {RpcTransport} from "@chippercash/protobuf-runtime-rpc";


export const RPC_TRANSPORT = new InjectionToken<RpcTransport>('RpcTransport');
