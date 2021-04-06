import {fixtures} from "../../test-fixtures";
import {reflectionCreate} from "../src";
import {normalizeFieldInfo, ScalarType} from "../src";
import type {IMessageType} from "../src";


describe('reflectionCreate()', function () {

    // TODO add fixtures for msg-maps.proto

    describe('creates fixture messages as expected', () => {
        fixtures.usingMessages((typeName, key, msg) => {
            it(`${typeName} '${key}'`, function () {
                const message = reflectionCreate(fixtures.makeMessageInfo(typeName));
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
        const msg = reflectionCreate({typeName: '.test.TestMessage', fields: [fld]});
        const val = msg[fld.localName];
        expect(val).toEqual({});
    });


    // TODO can be replaced by fixture for msg-maps.proto

    it('does not set default message', () => {
        const fld = normalizeFieldInfo({
            kind: 'message', T: () => true as unknown as IMessageType<any>,
            no: 1, name: 'msg_field', localName: 'msg_field', jsonName: 'msg_field',
        });
        const msg = reflectionCreate({typeName: '.test.TestMessage', fields: [fld]});
        const val = msg[fld.localName];
        expect(val).toBeUndefined()
    });


});
