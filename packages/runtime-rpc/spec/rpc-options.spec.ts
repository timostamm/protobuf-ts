import {mergeRpcOptions, RpcOptions} from "../src";
import type {IMessageType} from "@protobuf-ts/runtime";


describe('mergeRpcOptions()', () => {

    it('does not require seconds argument', function () {
        let opt = mergeRpcOptions({deadline: 123}, undefined);
        expect(opt).toEqual({deadline: 123});
    });

    it('merges interceptors', function () {
        let opt = mergeRpcOptions({interceptors: [{}]}, {interceptors: [{}]});
        expect(opt.interceptors.length).toBe(2);
    });

    it('adds default interceptors first', function () {
        let first = {};
        let second = {};
        let opt = mergeRpcOptions({interceptors: [first]}, {interceptors: [second]});
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
        let act = mergeRpcOptions(def, opt);
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
        let c = mergeRpcOptions(a, b);
        expect(c.meta).toEqual({
            overwrite: "b",
            a: "a",
            b: "b",
        });
    });


});
