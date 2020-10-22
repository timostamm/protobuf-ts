import {MethodInfo, RpcInterceptor, ServiceType} from "@protobuf-ts/runtime-rpc";
import {IMessageType} from "@protobuf-ts/runtime";
import {TwirpFetchTransport, TwirpOptions} from "../src";
import {GrpcWebOptions} from "../../grpcweb-transport/src";

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
        let service = new ServiceType(serviceTypeName, [
            {
                name: methodOriginalName, localName: methodLocalName, O: null as unknown as IMessageType<any>,
                I: null as unknown as IMessageType<any>,
            }
        ]);
        let transport = new class X extends TwirpFetchTransport {
            public makeUrl(method: MethodInfo, options: GrpcWebOptions): string {
                return super.makeUrl(method, options);
            }
        }(options);
        return transport.makeUrl(service.methods[0], options);
    }


});
