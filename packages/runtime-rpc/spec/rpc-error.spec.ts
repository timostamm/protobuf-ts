import {RpcError} from "../src";


describe('RpcError', () => {

    it('should have default code "UNKNOWN"', function () {
        let err = new RpcError("msg");
        expect(err.code).toBe("UNKNOWN");
    });

    it('should have default meta {}}', function () {
        let err = new RpcError("msg");
        expect(err.meta).toEqual({});
    });

    it('should use ctor code', function () {
        let err = new RpcError("msg", "cde");
        expect(err.code).toBe("cde");
    });

    it('should use ctor message', function () {
        let err = new RpcError("msg");
        expect(err.message).toBe("msg");
    });

    it('should use ctor meta', function () {
        let err = new RpcError("msg", "cde", {
            x: "y"
        });
        expect(err.meta).toEqual({
            x: "y"
        });
    });

    it('should toString() expected', function () {
        let err = new RpcError("msg", "cde", {
            x: "y",
            foo: "bar"
        });
        expect(err.toString()).toBe('RpcError: msg\n\nCode: cde\n\nMeta:\n  x: y\n  foo: bar');
        err.methodName = "Qux";
        err.serviceName = "Foo.Bar.Baz";
        expect(err.toString()).toBe('RpcError: msg\n\nCode: cde\nMethod: Foo.Bar.Baz/Qux\n\nMeta:\n  x: y\n  foo: bar');
    });


});
