import {ServerStreamingCall} from "./server-streaming-call";
import {ClientStreamingCall} from "./client-streaming-call";
import {DuplexStreamingCall} from "./duplex-streaming-call";
import {RpcTransport} from "./rpc-transport";
import {MethodInfo} from "./reflection-info";
import {RpcOptions} from "./rpc-options";
import {UnaryCall} from "./unary-call";


/**
 * Interceptors can be used to manipulate request and response data.
 *
 * They are commonly used to add authentication metadata, log requests
 * or implement client side caching.
 *
 * Interceptors are stacked. Call next() to invoke the next interceptor
 * on the stack. To manipulate the request, change the data passed to
 * next(). To manipulate a response, change the data returned by next().
 *
 * The following example adds an 'Authorization' header to unary calls:
 *
 * ```typescript
 * interceptUnary(next, method, input, options): UnaryCall {
 *   let opt: RpcOptions = options ?? {};
 *   if (!opt.meta) {
 *     opt.meta = {};
 *   }
 *   opt.meta['Authorization'] = 'xxx';
 *   return next(method, input, opt);
 * }
 * ```
 *
 * The following example intercepts server streaming calls. Every
 * message that the server sends is emitted twice to the client:
 *
 * ```typescript
 * interceptServerStreaming(next, method, input, options) {
 *   let original = next(method, input, options);
 *   let response = new RpcOutputStreamController();
 *   original.response.onNext((message, error, done) => {
 *     if (message) {
 *       response.notifyMessage(message);
 *       response.notifyMessage(message);
 *     }
 *     if (error)
 *       response.notifyError(error);
 *     if (done)
 *       response.notifyComplete();
 *   });
 *   return new ServerStreamingCall(
 *     original.method,
 *     original.requestHeaders,
 *     original.request,
 *     original.headers,
 *     response,
 *     original.status,
 *     original.trailers
 *   );
 * }
 * ```
 *
 */
export interface RpcInterceptor {

    interceptUnary?(
        next: NextUnaryFn,
        method: MethodInfo,
        input: object, options: RpcOptions): UnaryCall;

    interceptServerStreaming?(
        next: NextServerStreamingFn,
        method: MethodInfo,
        input: object, options: RpcOptions): ServerStreamingCall;

    interceptClientStreaming?(
        next: NextClientStreamingFn,
        method: MethodInfo,
        options: RpcOptions): ClientStreamingCall;

    interceptDuplex?(
        next: NextDuplexStreamingFn,
        method: MethodInfo,
        options: RpcOptions): DuplexStreamingCall;

}

/**
 * Invokes the next interceptor on the stack and returns its result.
 */
export type NextUnaryFn = (method: MethodInfo, input: object, options: RpcOptions) => UnaryCall;
/**
 * Invokes the next interceptor on the stack and returns its result.
 */
export type NextServerStreamingFn = (method: MethodInfo, input: object, options: RpcOptions) => ServerStreamingCall;
/**
 * Invokes the next interceptor on the stack and returns its result.
 */
export type NextClientStreamingFn = (method: MethodInfo, options: RpcOptions) => ClientStreamingCall;
/**
 * Invokes the next interceptor on the stack and returns its result.
 */
export type NextDuplexStreamingFn = (method: MethodInfo, options: RpcOptions) => DuplexStreamingCall;


/**
 * Creates a "stack" of of all unary interceptors specified in the given `RpcOptions`.
 * Used by generated client implementations.
 * @internal
 */
export function stackUnaryInterceptors<I extends object, O extends object>(
    transport: RpcTransport,
    method: MethodInfo<I, O>,
    input: I,
    options: RpcOptions): UnaryCall<I, O> {
    let tail: NextUnaryFn = (mtd, inp, opt) => transport.unary(mtd, inp, opt);
    for (const curr of (options.interceptors ?? []).filter(i => i.interceptUnary).reverse()) {
        const next = tail;
        tail = (mtd, inp, opt) => curr.interceptUnary!(next, mtd, inp, opt);
    }
    return tail(method, input, options) as UnaryCall<I, O>;
}

/**
 * Creates a "stack" of of all server streaming interceptors specified in the given `RpcOptions`.
 * Used by generated client implementations.
 * @internal
 */
export function stackServerStreamingInterceptors<I extends object, O extends object>(
    transport: RpcTransport,
    method: MethodInfo<I, O>,
    input: I,
    options: RpcOptions): ServerStreamingCall<I, O> {
    let tail: NextServerStreamingFn = (mtd, inp, opt) => transport.serverStreaming(mtd, inp, opt);
    for (const curr of (options.interceptors ?? []).filter(i => i.interceptServerStreaming).reverse()) {
        const next = tail;
        tail = (mtd, inp, opt) => curr.interceptServerStreaming!(next, mtd, inp, opt);
    }
    return tail(method, input, options) as ServerStreamingCall<I, O>;
}

/**
 * Creates a "stack" of of all client streaming interceptors specified in the given `RpcOptions`.
 * Used by generated client implementations.
 * @internal
 */
export function stackClientStreamingInterceptors<I extends object, O extends object>(
    transport: RpcTransport,
    method: MethodInfo<I, O>,
    options: RpcOptions): ClientStreamingCall<I, O> {
    let tail: NextClientStreamingFn = (mtd, opt) => transport.clientStreaming(mtd, opt);
    for (const curr of (options.interceptors ?? []).filter(i => i.interceptClientStreaming).reverse()) {
        const next = tail;
        tail = (mtd, opt) => curr.interceptClientStreaming!(next, mtd, opt);
    }
    return tail(method, options) as ClientStreamingCall<I, O>;
}

/**
 * Creates a "stack" of of all duplex streaming interceptors specified in the given `RpcOptions`.
 * Used by generated client implementations.
 * @internal
 */
export function stackDuplexStreamingInterceptors<I extends object, O extends object>(
    transport: RpcTransport,
    method: MethodInfo<I, O>,
    options: RpcOptions): DuplexStreamingCall<I, O> {
    let tail: NextDuplexStreamingFn = (mtd, opt) => transport.duplex(mtd, opt);
    for (const curr of (options.interceptors ?? []).filter(i => i.interceptDuplex).reverse()) {
        const next = tail;
        tail = (mtd, opt) => curr.interceptDuplex!(next, mtd, opt);
    }
    return tail(method, options) as DuplexStreamingCall<I, O>;
}

