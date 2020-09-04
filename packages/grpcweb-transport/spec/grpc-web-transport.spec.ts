import {GrpcWebFetchTransport, GrpcWebOptions} from "../src";
import {MethodInfo, RpcInterceptor, ServiceInfo} from "@protobuf-ts/runtime-rpc";
import {IMessageType} from "@protobuf-ts/runtime";

describe('GrpcWebFetchTransport', () => {

    describe('mergeOptions()', function () {
        let a: RpcInterceptor = {};
        let b: RpcInterceptor = {};
        let c: RpcInterceptor = {};
        let d: RpcInterceptor = {};
        it('should merge interceptors', function () {
            let transport = new GrpcWebFetchTransport({
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

        it('should use the methods original name', function () {
            let url = makeUrl({baseUrl: "http://localhost/prefix"}, "MyService", "localName", "original_name");
            expect(url).toBe("http://localhost/prefix/MyService/original_name");
        });

        it('should use the package name', function () {
            let url = makeUrl({baseUrl: "http://localhost/prefix"}, "package.MyService", "localName", "original_name");
            expect(url).toBe("http://localhost/prefix/package.MyService/original_name");
        });

        it('should drop trailing slash', function () {
            let url = makeUrl({baseUrl: "http://localhost/prefix/"}, "MyService", "localName", "original_name");
            expect(url).toBe("http://localhost/prefix/MyService/original_name");
        });

    });

    function makeUrl(options: GrpcWebOptions, serviceTypeName: string, methodLocalName: string, methodOriginalName: string): string {
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
        let transport = new GrpcWebFetchTransport(options);
        // @ts-ignore
        return transport.makeUrl(method, options);
    }


});
