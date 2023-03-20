import {
    GrpcStatusCode,
    createGrpcWebRequestHeader,
    readGrpcWebResponseHeader,
    readGrpcWebResponseTrailer,
} from '../src';
import {
    GrpcWebFrame,
    createGrpcWebRequestBody
} from '../src/grpc-web-format';
import { asciiToBin, asciiToCharCodes, assertFrames, getFrameRef } from './support/utils.spec';

import { RpcError } from '@protobuf-ts/runtime-rpc';

const D = GrpcWebFrame.DATA;
const T = GrpcWebFrame.TRAILER;
const trailerFromObject = (o: { readonly [key: string]: unknown }) => asciiToBin(
    Object.entries(o).map((tuple) => tuple.join(':')).join('\r\n')
);

describe('createGrpcWebRequestHeader', () => {
    beforeAll(() => {
        // Ensure the `Date` is stable
        jasmine.clock().install();
        jasmine.clock().mockDate();
    });

    afterAll(() => {
        jasmine.clock().uninstall();
    });

    it('adds RpcMetadata to Headers', () => {
        const actual = createGrpcWebRequestHeader(
            new globalThis.Headers(),
            'text',
            undefined,
            {
                foo: ['bar', 'baz'],
                qux: 'lux'
            }
        );
        expect(actual.get('foo')).toBe('bar, baz');
        expect(actual.get('qux')).toBe('lux');
    });

    it('overwrites the `Context-Type` header based on the specified `GrpcWebFormat`', () => {
        const setInHeaders = createGrpcWebRequestHeader(
            new globalThis.Headers([['Content-Type', 'text/plain']]),
            'text',
            undefined
        );
        expect(setInHeaders.get('Content-Type')).toBe('application/grpc-web-text');

        const setInMeta = createGrpcWebRequestHeader(
            new globalThis.Headers([['Content-Type', 'text/plain']]),
            'binary',
            undefined,
            { 'Content-Type': 'application/octet-stream'}
        );
        expect(setInMeta.get('Content-Type')).toBe('application/grpc-web+proto');
    });

    it('sets the X-Grpc-Web header', () => {
        const actual = createGrpcWebRequestHeader(
            new globalThis.Headers(),
            'text',
            undefined
        );
        expect(actual.get('X-Grpc-Web')).toBe('1');
    });

    it('sets the Accept header when the `GrpcWebFormat` is set to `text`', () => {
        const textFormat = createGrpcWebRequestHeader(
            new globalThis.Headers(),
            'text',
            undefined
        );
        expect(textFormat.get('Accept')).toBe('application/grpc-web-text');

        const binaryFormat = createGrpcWebRequestHeader(
            new globalThis.Headers(),
            'binary',
            undefined
        );
        expect(binaryFormat.has('Accept')).toBe(false);
    });

    it('sets the X-User-Agent header if the `userAgent` parameter was provided', () => {
        const uaSet = createGrpcWebRequestHeader(
            new globalThis.Headers(),
            'text',
            undefined,
            {},
            'foo'
        );
        expect(uaSet.get('X-User-Agent')).toBe('foo');

        const uaNotSet = createGrpcWebRequestHeader(
            new globalThis.Headers(),
            'text',
            undefined
        );
        expect(uaNotSet.has('X-User-Agent')).toBe(false);
    });

    it('sets the grpc-timeout header if the `timeout` parameter was provided', () => {
        const number = createGrpcWebRequestHeader(
            new globalThis.Headers(),
            'text',
            1
        );
        expect(number.get('grpc-timeout')).toBe('1m');

        const date = createGrpcWebRequestHeader(
            new globalThis.Headers(),
            'text',
            new Date(Date.now() + 1000)
        );
        expect(date.get('grpc-timeout')).toBe('1000m');
    });

    it('throws a DEADLINE_EXCEEDED error if the `timeout` is not in the future', () => {
        try {
            createGrpcWebRequestHeader( new globalThis.Headers(), 'text', -1);
            fail('The deadline was in the past and did not throw');
        } catch (e) {
            expect(e).toBeInstanceOf(RpcError);
            expect(e.code).toBe(GrpcStatusCode[GrpcStatusCode.DEADLINE_EXCEEDED])
        }

        try {
            createGrpcWebRequestHeader(new globalThis.Headers(), 'text', 0);
            fail('The deadline was not in the future and did not throw');
        } catch (e) {
            expect(e).toBeInstanceOf(RpcError);
            expect(e.code).toBe(GrpcStatusCode[GrpcStatusCode.DEADLINE_EXCEEDED])
        }

        try {
            createGrpcWebRequestHeader(new globalThis.Headers(), 'text', new Date(Date.now() - 1));
            fail('The deadline was in the past and did not throw');
        } catch (e) {
            expect(e).toBeInstanceOf(RpcError);
            expect(e.code).toBe(GrpcStatusCode[GrpcStatusCode.DEADLINE_EXCEEDED])
        }

        try {
            createGrpcWebRequestHeader(new globalThis.Headers(), 'text', new Date(Date.now()));
            fail('The deadline was not in the future and did not throw');
        } catch (e) {
            expect(e).toBeInstanceOf(RpcError);
            expect(e.code).toBe(GrpcStatusCode[GrpcStatusCode.DEADLINE_EXCEEDED])
        }
    });
});

describe('readGrpcWebResponse', () => {

    describe('Header()', function () {
        it('throws for an error or opaque Response', function () {
            // Response#type is read-only so we have to fake it
            ['error', 'opaque', 'opaqueredirect'].forEach((type) => {
                expect(() =>
                    readGrpcWebResponseHeader({ type } as Response)
                ).toThrowError(RpcError);
            });
        });

        it('returns internal gRPC status/message if invalid grpc status/message returned in HTTP headers', function () {
            const messageInvalid = readGrpcWebResponseHeader({ 'grpc-message': [] }, 400, '');
            expect(messageInvalid[0]).toEqual(GrpcStatusCode.INTERNAL);

            const statusInvalid1 = readGrpcWebResponseHeader({ 'grpc-status': '-1' }, 400, '');
            expect(statusInvalid1[0]).toEqual(GrpcStatusCode.INTERNAL);

            const statusInvalid2 = readGrpcWebResponseHeader({ 'grpc-status': [] }, 400, '');
            expect(statusInvalid2[0]).toEqual(GrpcStatusCode.INTERNAL);
        });

        it('handles empty HTTP headers', function () {
            const actual1 = readGrpcWebResponseHeader({}, 200, 'success');
            expect(actual1).toEqual([undefined, undefined, {}]);

            const actual2 = readGrpcWebResponseHeader({}, 400, 'invalid');
            expect(actual2).toEqual([GrpcStatusCode.INVALID_ARGUMENT, 'invalid', {}]);
        });

        it('handles normal Responses', function () {
            const headers = new globalThis.Headers([
                ['foo', 'bar'],
                ['foo', 'baz'],
                ['foo', 'qux'],
                ['grpc-status', '0'],
                ['grpc-message', 'ok'],
            ]);
            const res = new globalThis.Response(null, {
                headers,
                status: 200,
                statusText: 'success'
            });
            const actual = readGrpcWebResponseHeader(res);
            expect(actual).toEqual([GrpcStatusCode.OK, 'ok', { foo: 'bar, baz, qux'}]);
        });

        it('translates non-OK HTTP responses into gRPC status and message', function () {
            const statusMap = new Map([
                [400, GrpcStatusCode.INVALID_ARGUMENT],
                [401, GrpcStatusCode.UNAUTHENTICATED],
                [403, GrpcStatusCode.PERMISSION_DENIED],
                [404, GrpcStatusCode.NOT_FOUND],
                [409, GrpcStatusCode.ABORTED],
                [412, GrpcStatusCode.FAILED_PRECONDITION],
                [429, GrpcStatusCode.RESOURCE_EXHAUSTED],
                [499, GrpcStatusCode.CANCELLED],
                [500, GrpcStatusCode.UNKNOWN],
                [501, GrpcStatusCode.UNIMPLEMENTED],
                [503, GrpcStatusCode.UNAVAILABLE],
                [504, GrpcStatusCode.DEADLINE_EXCEEDED],
            ]);

            const headers = { 'grpc-status': '0' };

            statusMap.forEach((statusCode, httpStatus) => {
                // @ts-ignore: we're not supposed to index into an enum
                const httpStatusText = `HTTP - ${GrpcStatusCode[GrpcStatusCode[statusCode]]}`;
                const actual = readGrpcWebResponseHeader(headers, httpStatus, httpStatusText);
                expect(actual).toEqual([statusCode, httpStatusText, {}]);
            });

            const actual = readGrpcWebResponseHeader(headers, 511, 'unknown');
            expect(actual).toEqual([GrpcStatusCode.UNKNOWN, 'unknown', {}]);
        });
    });

    describe('Body()', function () {
        it('handles an invalid tag', async function () {
            const { next, overall } = getFrameRef();
            await next([1, 0], true);
            await expectAsync(overall).toBeRejectedWithError(RpcError);
        });

        it('handles invalid content-type', async function () {
            await expectAsync(getFrameRef({ format: 'unknown' }).overall).toBeRejectedWithError(RpcError);
            await expectAsync(getFrameRef({ format: null }).overall).toBeRejectedWithError(RpcError);
        });

        it('handles a basic message', async function () {
            const { frames, next } = getFrameRef();
            await next([0, 0, 0, 0, 2, 38, 39], true);
            assertFrames(frames, [
                [D, [38, 39]],
            ]);
        });

        it('handles a basic message in text encoding', async function () {
            const { frames, next } = getFrameRef({ format: 'application/grpc-web-text' });
            const input = [38, 39];
            const message = createGrpcWebRequestBody(new Uint8Array(input), 'text');
            const [first, ...rest] = asciiToCharCodes(message);

            await next([first]);
            assertFrames(frames, []);

            await next(rest, true);
            assertFrames(frames, [
                [D, input],
            ]);
        })

        it('handles one message one trailer', async function () {
            const { frames, next } = getFrameRef();
            await next([0, 0, 0, 0, 2, 38, 39, 128, 0, 0, 0, 2, 40, 41], true);
            assertFrames(frames, [
                [D, [38, 39]],
                [T, [40, 41]],
            ]);
        });

        it('handles multiple messages one trailer', async function () {
            const { frames, next } = getFrameRef();
            await next([0, 0, 0, 0, 2, 38, 39, 0, 0, 0, 0, 3, 42, 43, 44, 128, 0, 0, 0, 2, 40, 41], true);
            assertFrames(frames, [
                [D, [38, 39]],
                [D, [42, 43, 44]],
                [T, [40, 41]],
            ]);
        });

        it('handles partial message', async function () {
            const { frames, next } = getFrameRef();
            await next([0, 0, 0, 0, 2, 38]);
            expect(frames.length).toBe(0);

            await next([39], true);
            assertFrames(frames, [
                [D, [38, 39]],
            ]);
        });

        it('handles multiple partial messages', async function () {
            const { frames, next } = getFrameRef();
            await next([0, 0, 0, 0, 2, 38]);
            assertFrames(frames, []);

            await next([39, 128, 0, 0]);
            assertFrames(frames, [
                [D, [38, 39]],
            ]);

            await next([0, 3, 40]);
            assertFrames(frames, [
                [D, [38, 39]],
            ]);

            await next([41, 42], true);
            assertFrames(frames, [
                [D, [38, 39]],
                [T, [40, 41, 42]],
            ]);
        });

        it('handles trailers only', async function () {
            const { frames, next } = getFrameRef();
            await next([128, 0, 0, 0, 2, 40, 41], true);
            assertFrames(frames, [
                [T, [40, 41]],
            ]);
        });

        it('handles empty message with trailer', async function () {
            const { frames, next } = getFrameRef();
            await next([0, 0, 0, 0, 0, 128, 0, 0, 0, 1, 56], true);
            assertFrames(frames, [
                [D, []],
                [T, [56]],
            ]);
        });

        it('handles error after first message', async function () {
            const { frames, next, overall } = getFrameRef();
            await next([0, 0, 0, 0, 2, 38, 39]);
            assertFrames(frames, [
                [D, [38, 39]],
            ]);

            await next([1, 0], true);
            await expectAsync(overall).toBeRejectedWithError(RpcError);
        });

        it('handles empty', async function () {
            const { frames, next } = getFrameRef();
            await next([], true);
            assertFrames(frames, []);
        });

        it('handles message after empty', async function () {
            const { frames, next } = getFrameRef();
            await next([]);
            assertFrames(frames, []);

            await next([]);
            assertFrames(frames, []);

            await next([0]);
            assertFrames(frames, []);

            await next([]);
            assertFrames(frames, []);

            await next([0, 0, 0]);
            assertFrames(frames, []);

            await next([2, 38, 39], true);
            assertFrames(frames, [
                [D, [38, 39]],
            ]);
        });

        it('handles a what-wg streams ReadableStream', async function () {
            const { frames, next } = getFrameRef({ useWhatWgStream: true });
            await next([0, 0, 0, 0, 2, 38, 39, 0, 0, 0, 0, 3, 42, 43, 44, 128, 0, 0, 0, 2, 40, 41], true);
            assertFrames(frames, [
                [D, [38, 39]],
                [D, [42, 43, 44]],
                [T, [40, 41]],
            ]);
        })
    });

    describe('Trailer()', function () {
        it('handles empty trailers', function () {
            const trailer = readGrpcWebResponseTrailer(new Uint8Array([]));
            expect(trailer).toEqual([GrpcStatusCode.OK, undefined, {}])
        });

        it('handles success status without message', function () {
            const trailer = readGrpcWebResponseTrailer(trailerFromObject({
                'grpc-status': GrpcStatusCode.OK,
            }));
            expect(trailer).toEqual([GrpcStatusCode.OK, undefined, {}])
        });

        it('handles message without status', function () {
            const message = 'some message';
            const trailer = readGrpcWebResponseTrailer(trailerFromObject({
                'grpc-message': message,
            }));
            expect(trailer).toEqual([GrpcStatusCode.OK, message, {}])
        });

        it('adds other headers to meta', function () {
            const someHeader = { foo: 'bar', baz: 'qux' };
            const trailer = readGrpcWebResponseTrailer(trailerFromObject(someHeader));
            expect(trailer).toEqual([GrpcStatusCode.OK, undefined, someHeader])
        });

        it('only considers "\\r\\n" to mark the end of a header value', function () {
            const someHeader = { foo: 'this(has: a colon)' };
            const trailer = readGrpcWebResponseTrailer(trailerFromObject(someHeader));
            expect(trailer).toEqual([GrpcStatusCode.OK, undefined, someHeader])
        });
    })

});
