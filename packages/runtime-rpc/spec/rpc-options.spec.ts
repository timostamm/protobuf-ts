import {mergeExtendedRpcOptions, RpcOptions} from "../src";
import {IMessageType} from "@protobuf-ts/runtime";


describe('mergeExtendedRpcOptions()', () => {

    it('does not require seconds argument', function () {
        let opt = mergeExtendedRpcOptions({deadline: 123}, undefined);
        expect(opt).toEqual({deadline: 123});
    });

    it('merges interceptors', function () {
        let opt = mergeExtendedRpcOptions({interceptors: [{}]}, {interceptors: [{}]});
        expect(opt.interceptors.length).toBe(2);
    });

    it('adds default interceptors first', function () {
        let first = {};
        let second = {};
        let opt = mergeExtendedRpcOptions({interceptors: [first]}, {interceptors: [second]});
        expect(opt.interceptors[0]).toBe(first);
    });

    it('merges jsonOptions', function () {
        let def: RpcOptions = {
            jsonOptions: {
                ignoreUnknownFields: true,
                useProtoFieldName: true,
                emitDefaultValues: true,
                enumAsInteger: true,
                typeRegistry: [1 as unknown as IMessageType<any>],
            }
        };
        let opt: RpcOptions = {
            jsonOptions: {
                ignoreUnknownFields: false,
                useProtoFieldName: false,
                emitDefaultValues: false,
                enumAsInteger: false,
                typeRegistry: [2 as unknown as IMessageType<any>],
            }
        };
        let act = mergeExtendedRpcOptions(def, opt);
        let exp: RpcOptions = {
            jsonOptions: {
                ignoreUnknownFields: false,
                useProtoFieldName: false,
                emitDefaultValues: false,
                enumAsInteger: false,
                typeRegistry: [1 as unknown as IMessageType<any>, 2 as unknown as IMessageType<any>],
            }
        };
        expect(act.jsonOptions).toEqual(exp.jsonOptions);
    });

    it('merges meta', function () {
        let a: RpcOptions = {
            meta: {
                overwrite: "a",
                a: "a",
            }
        };
        let b: RpcOptions = {
            meta: {
                overwrite: "b",
                b: "b",
            }
        };
        let c = mergeExtendedRpcOptions(a, b);
        expect(c.meta).toEqual({
            overwrite: "b",
            a: "a",
            b: "b",
        });
    });


});
