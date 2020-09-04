import {MethodInfo, RpcInterceptor, ServiceInfo} from "@protobuf-ts/runtime-rpc";
import {IMessageType} from "@protobuf-ts/runtime";
import {TwirpFetchTransport, TwirpOptions} from "../src";

describe('TwirpFetchTransport', () => {

    describe('mergeOptions()', function () {
        let a: RpcInterceptor = {};
        let b: RpcInterceptor = {};
        let c: RpcInterceptor = {};
        let d: RpcInterceptor = {};
        it('should merge interceptors', function () {
            let transport = new TwirpFetchTransport({
                baseUrl: "fake",
                interceptors: [a, b],
            });
            let options = transport.mergeOptions({
                interceptors: [c, d],
            });
            expect(options.interceptors).toEqual([a, b, c, d]);
        });
    });

    describe('makeUrl()', function () {

        it('should honor option `useProtoMethodName`', function () {
            let url = makeUrl({
                baseUrl: "http://localhost/prefix",
                useProtoMethodName: true,
            }, "MyService", "localName", "original_name");
            expect(url).toBe("http://localhost/prefix/MyService/original_name");
        });

        it('should CamelCase method name', function () {
            let url = makeUrl({
                baseUrl: "http://localhost/prefix",
            }, "MyService", "localName", "original_name");
            expect(url).toBe("http://localhost/prefix/MyService/OriginalName");
        });

        it('should use the package name', function () {
            let url = makeUrl({baseUrl: "http://localhost/prefix"}, "package.MyService", "localName", "original_name");
            expect(url).toBe("http://localhost/prefix/package.MyService/OriginalName");
        });

        it('should drop trailing slash', function () {
            let url = makeUrl({baseUrl: "http://localhost/prefix/"}, "MyService", "localName", "original_name");
            expect(url).toBe("http://localhost/prefix/MyService/OriginalName");
        });

    });

    function makeUrl(options: TwirpOptions, serviceTypeName: string, methodLocalName: string, methodOriginalName: string): string {
        let service: ServiceInfo = {
            typeName: serviceTypeName,
            methods: []
        };
        let method: MethodInfo = {
            service: service,
            name: methodOriginalName,
            localName: methodLocalName,
            O: null as unknown as IMessageType<any>,
            I: null as unknown as IMessageType<any>,
        };
        service.methods.push(method);
        let transport = new TwirpFetchTransport(options);
        // @ts-ignore
        return transport.makeUrl(method, options);
    }


});
