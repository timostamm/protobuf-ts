import {isJsonObject, JsonValue} from "@chippercash/protobuf-runtime";
import {RpcError, RpcMetadata} from "@chippercash/protobuf-runtime-rpc";
import {TwirpErrorCode} from "./twitch-twirp-error-code";

/**
 * Create fetch API headers for a Twirp request.
 */
export function createTwirpRequestHeader(headers: Headers, sendJson: boolean, meta?: RpcMetadata): Headers {
    // add meta as headers
    if (meta) {
        for (let [k, v] of Object.entries(meta)) {
            if (typeof v == "string")
                headers.append(k, v);
            else
                for (let i of v)
                    headers.append(k, i);
        }
    }
    // set standard headers (possibly overwriting meta)
    headers.set('Content-Type', sendJson ? "application/json" : "application/protobuf");
    headers.set('Accept', sendJson ? "application/json" : "application/protobuf, application/json");
    return headers;
}


/**
 * Parse Twirp error message from JSON and create RpcError from the Twirp error.
 *
 * see https://twitchtv.github.io/twirp/docs/spec_v5.html
 */
export function parseTwirpErrorResponse(json: JsonValue): RpcError {
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
 * Parses fetch API response headers to RpcMetaData.
 * Drops the headers Content-Type and Content-Length.
 */
export function parseMetadataFromResponseHeaders(headers: Headers): RpcMetadata {
    let meta: RpcMetadata = {};
    headers.forEach((value, key) => {
        if (key.toLowerCase() === 'content-type')
            return;
        if (key.toLowerCase() === 'content-length')
            return;
        if (meta.hasOwnProperty(key))
            (meta[key] as string[]).push(value);
        else
            meta[key] = value;
    });
    return meta;
}
