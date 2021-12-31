import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {
  ClientStreamingCall,
  Deferred,
  DuplexStreamingCall,
  mergeRpcOptions,
  MethodInfo,
  RpcError,
  RpcMetadata,
  RpcOptions,
  RpcStatus,
  RpcTransport,
  ServerStreamingCall,
  UnaryCall
} from "@protobuf-ts/runtime-rpc";
import {isJsonObject, JsonValue, lowerCamelCase, utf8read} from "@protobuf-ts/runtime";
import {fromEvent, NEVER, of} from "rxjs";
import {TwirpErrorCode, TwirpOptions} from "@protobuf-ts/twirp-transport";
import {Inject, Injectable} from "@angular/core";
import {TWIRP_TRANSPORT_OPTIONS} from "./twirp-transport-options";
import {takeUntil} from "rxjs/operators";


/**
 * Implements the Twirp protocol, supporting JSON or binary format on
 * the wire. See https://twitchtv.github.io/twirp/docs/spec_v5.html
 *
 * Uses `HttpClient` of @angular/common/http for requests.
 *
 * This is an injectable service. To inject, you must provide the
 * injection token TWIRP_TRANSPORT_OPTIONS. For easy integration,
 * just add TwirpAngularModule.forRoot() to the "imports" of your
 * `AppComponent`. The method takes a `TwirpOptions` argument.
 */
@Injectable()
export class TwirpTransport implements RpcTransport {

  protected readonly defaultOptions: TwirpOptions;
  protected readonly http: HttpClient;

  constructor(@Inject(TWIRP_TRANSPORT_OPTIONS) options: TwirpOptions, http: HttpClient) {
    this.defaultOptions = options;
    this.http = http;
  }

  mergeOptions(options?: Partial<RpcOptions>): RpcOptions {
    return mergeRpcOptions(this.defaultOptions, options);
  }

  unary<I extends object, O extends object>(method: MethodInfo, input: I, options: RpcOptions): UnaryCall<I, O> {
    let opt = options as TwirpOptions,
      url = this.makeUrl(method, opt),
      requestBody = opt.sendJson ? method.I.toJsonString(input, opt.jsonOptions) : method.I.toBinary(input, opt.binaryOptions).buffer,
      defHeader = new Deferred<RpcMetadata>(),
      defMessage = new Deferred<O>(),
      defStatus = new Deferred<RpcStatus>(),
      defTrailer = new Deferred<RpcMetadata>(),
      abortObservable = !options.abort ? NEVER : (
        options.abort.aborted
          ? of(undefined)
          : fromEvent(options.abort, "abort")
      );

    this.http.request('POST', url, {
      body: requestBody,
      headers: createTwirpRequestHeader(!!opt.sendJson, opt.meta),
      responseType: "arraybuffer",
      observe: "response",
    })
      .pipe(
        takeUntil(abortObservable)
      )
      .toPromise()
      .then(ngResponse => {

        if (ngResponse === undefined && options.abort?.aborted)
          return undefined;

        defHeader.resolve(parseMetadataFromResponseHeaders(ngResponse.headers));

        if (!ngResponse.body)
          throw new RpcError('premature end of response', TwirpErrorCode[TwirpErrorCode.dataloss]);

        if (!ngResponse.ok)
          throw parseTwirpErrorResponse(ngResponse.body);

        if (opt.sendJson) {
          try {
            return method.O.fromJsonString(utf8read(new Uint8Array(ngResponse.body)), opt.jsonOptions);
          } catch (e) {
            throw new RpcError('unable to read response body as json', TwirpErrorCode[TwirpErrorCode.dataloss]);
          }
        }

        try {
          return method.O.fromBinary(new Uint8Array(ngResponse.body), opt.binaryOptions);
        } catch (e) {
          throw new RpcError('unable to read response body', TwirpErrorCode[TwirpErrorCode.dataloss]);
        }

      }, reason => {
        if (reason instanceof HttpErrorResponse) {
          if (reason.error instanceof ArrayBuffer)
            throw parseTwirpErrorResponse(reason.error);
          throw new RpcError(reason.message, TwirpErrorCode[TwirpErrorCode.unknown]);
        }
        throw new RpcError("unknown error", TwirpErrorCode[TwirpErrorCode.unknown]);
      })

      .then(message => {
        if (message === undefined &&  options.abort?.aborted)
          throw new RpcError("request cancelled", TwirpErrorCode[TwirpErrorCode.cancelled]);
        defMessage.resolve(message);
        defStatus.resolve({code: 'OK', detail: ''});
        defTrailer.resolve({});

      })

      .catch((reason: any) => {
        // RpcErrors are thrown by us, everything else is an internal error
        let error = reason instanceof RpcError ? reason
          : new RpcError(reason instanceof Error ? reason.message : reason, TwirpErrorCode[TwirpErrorCode.internal]);
        error.methodName = method.name;
        error.serviceName  = method.service.typeName;
        defHeader.rejectPending(error);
        defMessage.rejectPending(error);
        defStatus.rejectPending(error);
        defTrailer.rejectPending(error);
      });

    return new UnaryCall<I, O>(
      method,
      opt.meta ?? {},
      input,
      defHeader.promise,
      defMessage.promise,
      defStatus.promise,
      defTrailer.promise,
    );
  }


  /**
   * Create an URI for a RPC call.
   *
   * Takes the `baseUrl` option and appends:
   * - slash "/"
   * - package name
   * - dot "."
   * - service name
   * - slash "/"
   * - method name
   *
   * If the service was declared without a package, the package name and dot
   * are omitted.
   *
   * The method name is CamelCased just as it would be in Go, unless the
   * option `useProtoMethodName` is `true`.
   */
  protected makeUrl(method: MethodInfo, options: TwirpOptions): string {
    let base = options.baseUrl;
    if (base.endsWith('/'))
      base = base.substring(0, base.length - 1);
    let methodName = method.name;
    if (options.useProtoMethodName !== true) {
      methodName = lowerCamelCase(methodName);
      methodName = methodName.substring(0, 1).toUpperCase() + methodName.substring(1);
    }
    return `${base}/${method.service.typeName}/${methodName}`;
  }


  clientStreaming<I extends object, O extends object>(method: MethodInfo<I, O>/*, options: RpcOptions*/): ClientStreamingCall<I, O> {
    const e = new RpcError('Client streaming is not supported by Twirp', TwirpErrorCode[TwirpErrorCode.unimplemented]);
    e.methodName = method.name;
    e.serviceName  = method.service.typeName;
    throw e;
  }

  duplex<I extends object, O extends object>(method: MethodInfo<I, O>/*, options: RpcOptions*/): DuplexStreamingCall<I, O> {
    const e = new RpcError('Duplex streaming is not supported by Twirp', TwirpErrorCode[TwirpErrorCode.unimplemented]);
    e.methodName = method.name;
    e.serviceName  = method.service.typeName;
    throw e;
  }

  serverStreaming<I extends object, O extends object>(method: MethodInfo<I, O>/*, input: I, options?: RpcOptions*/): ServerStreamingCall<I, O> {
    const e = new RpcError('Server streaming is not supported by Twirp', TwirpErrorCode[TwirpErrorCode.unimplemented]);
    e.methodName = method.name;
    e.serviceName  = method.service.typeName;
    throw e;
  }

}


/**
 * Create Angular headers for a Twirp request.
 */
export function createTwirpRequestHeader(sendJson: boolean, meta?: RpcMetadata): HttpHeaders {
  let headers = new HttpHeaders();
  // add meta as headers
  if (meta) {
    for (let [k, v] of Object.entries(meta)) {
      if (typeof v == "string")
        headers = headers.append(k, v);
      else
        for (let i of v)
          headers = headers.append(k, i);
    }
  }
  // set standard headers (possibly overwriting meta)
  headers = headers.set('Content-Type', sendJson ? "application/json" : "application/protobuf");
  headers = headers.set('Accept', sendJson ? "application/json" : "application/protobuf, application/json");
  return headers;
}


/**
 * Parse Twirp error message from JSON (given as array buffer) and create
 * RpcError from the Twirp error.
 *
 * see https://twitchtv.github.io/twirp/docs/spec_v5.html
 */
function parseTwirpErrorResponse(data: ArrayBuffer): RpcError {
  let json: JsonValue;
  try {
    json = JSON.parse(utf8read(new Uint8Array(data)));
  } catch (e) {
    return new RpcError('cannot read twirp error response', TwirpErrorCode[TwirpErrorCode.internal]);
  }
  if (!isJsonObject(json) || typeof json.code !== "string" || typeof json.msg !== "string")
    return new RpcError('cannot read twirp error response', TwirpErrorCode[TwirpErrorCode.internal]);
  let meta: RpcMetadata = {};
  if (isJsonObject(json.meta)) {
    for (let [k, v] of Object.entries(json.meta)) {
      if (typeof v == "string")
        meta[k] = v;
    }
  }
  return new RpcError(json.msg, json.code, meta);
}


/**
 * Parses Angular response headers to RpcMetaData.
 * Drops the headers Content-Type and Content-Length.
 */
function parseMetadataFromResponseHeaders(headers: HttpHeaders): RpcMetadata {
  let meta: RpcMetadata = {};
  for (let key of headers.keys()) {
    if (key.toLowerCase() === 'content-type')
      continue;
    if (key.toLowerCase() === 'content-length')
      continue;
    let values = headers.getAll(key);
    if (!values)
      continue;
    for (let val of values) {
      if (meta.hasOwnProperty(key))
        (meta[key] as string[]).push(val);
      else
        meta[key] = val;
    }
  }
  return meta;
}

