import {RpcInterceptor, ServerStreamingCall, UnaryCall} from '@protobuf-ts/runtime-rpc';


/**
 * Shows how to add a token in the "authorization" request header.
 */
export const addAuthHeaderInterceptor: RpcInterceptor = {
  interceptUnary(next, method, input, options): UnaryCall {
    if (!options.meta) {
      options.meta = {};
    }
    options.meta.Authorization = 'xxx';
    console.log('unary interceptor added authorization header');
    return next(method, input, options);
  },
  interceptServerStreaming(next, method, input, options): ServerStreamingCall {
    if (!options.meta) {
      options.meta = {};
    }
    options.meta.Authorization = 'xxx';
    console.log('server streaming interceptor added authorization header');
    return next(method, input, options);
  }
}
