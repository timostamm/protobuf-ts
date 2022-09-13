import {fixtures} from "../../test-fixtures";
import type {IMessageType} from "../src";
import {MessageType, normalizeFieldInfo, reflectionCreate, ScalarType, UnknownMessage} from "../src";


describe('reflectionCreate()', function () {

    // TODO add fixtures for msg-maps.proto

    describe('creates fixture messages as expected', () => {
        fixtures.usingMessages((typeName, key, msg) => {
            it(`${typeName} '${key}'`, function () {
                const mi = fixtures.makeMessageInfo(typeName);
                const mt = new MessageType<UnknownMessage>(mi.typeName, mi.fields, mi.options);
                const message = reflectionCreate(mt);
                const defaults = fixtures.getMessage(typeName, 'default');
                expect(message).toEqual(defaults);
            });
        });

        fixtures.usingMessages((typeName, key, msg) => {
            it(`${typeName} '${key}' proto2`, function () {
                const mi = fixtures.makeMessageInfo(typeName, "proto2");
                const mt = new MessageType<UnknownMessage>(mi.typeName, mi.fields, mi.options);
                const message = reflectionCreate(mt);
                const defaults = fixtures.getMessage(typeName, 'default');
                expect(message).toEqual(defaults);
            });
        });
        
    });


    // TODO can be replaced by fixture for msg-maps.proto
    it('sets default map', () => {
        const fld = normalizeFieldInfo({
            kind: 'map',
            K: ScalarType.STRING,
            V: {kind: "scalar", T: ScalarType.STRING},
            no: 1,
            name: 'map_field'
        });
        const msg = reflectionCreate(new MessageType<UnknownMessage>('.test.TestMessage', [fld]));
        const val = msg[fld.localName];
        expect(val).toEqual({});
    });


    // TODO can be replaced by fixture for msg-maps.proto

    it('does not set default message', () => {
        const fld = normalizeFieldInfo({
            kind: 'message', T: () => true as unknown as IMessageType<any>,
            no: 1, name: 'msg_field', localName: 'msg_field', jsonName: 'msg_field',
        });
        const msg = reflectionCreate(new MessageType<UnknownMessage>('.test.TestMessage', [fld]));
        const val = msg[fld.localName];
        expect(val).toBeUndefined()
    });


});
