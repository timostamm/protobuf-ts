import * as grpc from "@grpc/grpc-js";
import {metadataFromGrpc, isServiceError, rpcCodeToGrpc, metadataToGrpc} from "../src/util";
import {RpcMetadata} from "@protobuf-ts/runtime-rpc";


describe('isServiceError', function () {

    it('returns true for a gRPC ServiceError', function () {
        let e: any = new Error();
        e.code = grpc.status.PERMISSION_DENIED;
        e.details = "x";
        e.metadata = new grpc.Metadata();
        expect(isServiceError(e)).toBeTrue();
    })

    it('returns false for a Error', function () {
        let e: any = new Error();
        expect(isServiceError(e)).toBeFalse();
    })

});


describe('rpcCodeToGrpc', function () {

    it('parses "OK"', function () {
        expect(rpcCodeToGrpc("OK")).toBe(grpc.status.OK);
    });

    it('parses "INTERNAL"', function () {
        expect(rpcCodeToGrpc("INTERNAL")).toBe(grpc.status.INTERNAL);
    });

    it('does not parse "FOO"', function () {
        expect(rpcCodeToGrpc("FOO")).toBeUndefined();
    });

    it('does not parse ""', function () {
        expect(rpcCodeToGrpc("FOO")).toBeUndefined();
    });

});


describe('metadataFromGrpc', function () {

    it('converts as expected', function () {

        let g = new grpc.Metadata();
        g.add('text', 'abc');
        g.add('text-array', 'a');
        g.add('text-array', 'b');
        g.add('text-array', 'c');
        g.add('foo-bin', Buffer.from('hellö wörld', 'utf8'));
        let m = metadataFromGrpc(g);

        expect(m).toEqual({
            'text': 'abc',
            'text-array': ['a', 'b', 'c'],
            'foo-bin': 'aGVsbMO2IHfDtnJsZA=='
        });
    });

});


describe('metadataToGrpc', function () {

    it('converts as expected', function () {

        let m: RpcMetadata = {
            'text': 'abc',
            'text-array': ['a', 'b', 'c'],
            'foo-bin': 'aGVsbMO2IHfDtnJsZA=='
        };

        let g = metadataToGrpc(m);
        expect(g.get('text')).toEqual(['abc']);
        expect(g.get('text-array')).toEqual(['a', 'b', 'c']);
        expect(g.get('foo-bin')).toEqual([
            Buffer.from('hellö wörld', 'utf8')
        ]);

    });

});

