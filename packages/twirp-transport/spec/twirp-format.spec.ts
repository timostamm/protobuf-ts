import {createTwirpRequestHeader, parseTwirpErrorResponse} from "../src";

describe('parseTwirpErrorResponse()', () => {
    it('requires JSON object', function () {
        let err = parseTwirpErrorResponse("xxx");
        expect(err.message).toBe("cannot read twirp error response")
    });
    it('requires JSON object with code: string', function () {
        let err = parseTwirpErrorResponse({code: 123, msg: "str"});
        expect(err.message).toBe("cannot read twirp error response")
    });
    it('requires JSON object with msg: string', function () {
        let err = parseTwirpErrorResponse({code: "unauthenticated", msg: 123});
        expect(err.message).toBe("cannot read twirp error response")
    });
    it('parses code', function () {
        let err = parseTwirpErrorResponse({code: "unauthenticated", msg: "str"});
        expect(err.code).toBe("unauthenticated")
    });
    it('parses msg', function () {
        let err = parseTwirpErrorResponse({code: "unauthenticated", msg: "str"});
        expect(err.message).toBe("str")
    });
    it('parses meta', function () {
        let err = parseTwirpErrorResponse({code: "unauthenticated", msg: "str", meta: {"foo": "bar"}});
        expect(err.meta).toEqual({
            "foo": "bar"
        })
    });
});


describe('createTwirpRequestHeader()', function () {
    let HeadersCtor = (globalThis.Headers ?? require("node-fetch").Headers) as typeof Headers;
    it('should set json content type', function () {
        let h = createTwirpRequestHeader(new HeadersCtor(), true);
        expect(h.get("Content-Type")).toBe("application/json");
    });
    it('should set binary content type', function () {
        let h = createTwirpRequestHeader(new HeadersCtor(), false);
        expect(h.get("Content-Type")).toBe("application/protobuf");
    });
});
