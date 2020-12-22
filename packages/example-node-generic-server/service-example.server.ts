import {ExampleRequest, ExampleResponse} from "./service-example";
import {RpcInputStream, RpcOutputStream, ServerCallContext} from "@protobuf-ts/runtime-rpc";


// TODO generate this interface if (ts.server) = GENERIC or --ts_opt server_generic
export interface IExampleService {

    unary(request: ExampleRequest, context: ServerCallContext): Promise<ExampleResponse>;

    serverStream(request: ExampleRequest, responses: RpcInputStream<ExampleResponse>, context: ServerCallContext): Promise<void>;

    clientStream(requests: RpcOutputStream, context: ServerCallContext): Promise<ExampleResponse>;

    bidi(requests: RpcOutputStream, responses: RpcInputStream<ExampleResponse>, context: ServerCallContext): Promise<void>;

}

