import {assert, isOneofGroup, normalizeFieldInfo, ReflectionTypeCheck, ScalarType} from "@protobuf-ts/runtime";
import {EnumFieldMessage} from "../ts-out/msg-enum";
import {MessageMapMessage, ScalarMapsMessage} from "../ts-out/msg-maps";
import {OneofMessageMemberMessage, OneofScalarMemberMessage} from "../ts-out/msg-oneofs";
import {TestAllTypesProto3} from "../ts-out/google/protobuf/test_messages_proto3";
import {TestAllTypesProto2} from "../ts-out/google/protobuf/test_messages_proto2";


describe('ReflectionTypeCheck.is()', function () {

    describe('accepts all fixture messages', function () {
        fixtures.usingMessages((typeName, key, msg) => {
            it(`${typeName} '${key}'`, function () {
                let check = new ReflectionTypeCheck(fixtures.makeMessageInfo(typeName));
                let is = check.is(msg, 16, false);
                expect(is).toBe(true);
            });
        });
    });

    describe('rejects all invalid fixture messages', function () {
        fixtures.usingInvalidMessages((typeName, key, msg) => {
            it(`${typeName} '${key}'`, function () {
                let check = new ReflectionTypeCheck(fixtures.makeMessageInfo(typeName));
                let is = check.is(msg, 16, false);
                expect(is).toBeFalse();
            });
        });
    });


    describe('check() with depth < 0', function () {
        it('always returns true', function () {
            let check = new ReflectionTypeCheck({typeName: 'fake', fields: []});
            let is = check.is("not a message", -1, false);
            expect(is).toBeTrue();
        });
    });

    describe('with a depth of 0', function () {

        it('checks if an object is passed', function () {

            let check = new ReflectionTypeCheck({
                typeName: 'fake', fields: [
                    normalizeFieldInfo({no: 1, name: "field", kind: "scalar", T: ScalarType.BOOL})
                ]
            });
            expect(check.is(false, 0, false)).toBe(false);
            expect(check.is(undefined, 0, false)).toBe(false);
            expect(check.is(null, 0, false)).toBe(false);
        });

        it('checks presence of fields but not types', function () {
            let check = new ReflectionTypeCheck(fixtures.makeMessageInfo('spec.ScalarValuesMessage'));
            let m = fixtures.getInvalidMessage('spec.ScalarValuesMessage', 'all types wrong');
            let is = check.is(m, 0, false);
            expect(is).toBe(true);
        });

        it('detects missing field', function () {
            let check = new ReflectionTypeCheck(fixtures.makeMessageInfo('spec.ScalarValuesMessage'));
            let m = fixtures.getMessage('spec.ScalarValuesMessage', 'default');
            delete m['doubleField'];
            let is = check.is(m, 0, false);
            expect(is).toBe(false);
        });

        it('detects unknown fields', function () {
            let check = new ReflectionTypeCheck(fixtures.makeMessageInfo('spec.ScalarValuesMessage'));
            let m = fixtures.getMessage('spec.ScalarValuesMessage', 'default');
            m.foo = 'bar';
            let is = check.is(m, 0, false);
            expect(is).toBe(false);
        });

    });


    describe('with a depth of 1', function () {

        const depth = 1;

        it('checks oneof group structure', function () {
            let check = new ReflectionTypeCheck(fixtures.makeMessageInfo('spec.OneofScalarMemberMessage'));
            let m = fixtures.getMessage('spec.OneofScalarMemberMessage', 'err');
            assert(isOneofGroup(m.result));
            m.result.oneofKind = 'xxx';
            let is = check.is(m, depth, false);
            expect(is).toBe(false);
        });

        it('checks oneof member type', function () {
            let check = new ReflectionTypeCheck(fixtures.makeMessageInfo('spec.OneofScalarMemberMessage'));
            let m = fixtures.getMessage('spec.OneofScalarMemberMessage', 'err');
            assert(isOneofGroup(m.result));
            m.result.error = 123;
            let is = check.is(m, depth, false);
            expect(is).toBe(false);
        });

        it('checks oneof discriminator', function () {
            let check = new ReflectionTypeCheck(fixtures.makeMessageInfo('spec.OneofScalarMemberMessage'));
            let m = fixtures.getMessage('spec.OneofScalarMemberMessage', 'err');
            assert(isOneofGroup(m.result));
            m.result = {
                oneofKind: 'wrong',
                wrong: 123
            };
            let is = check.is(m, depth, false);
            expect(is).toBe(false);
        });

        it('checks repeated is array', function () {
            let check = new ReflectionTypeCheck(fixtures.makeMessageInfo('spec.RepeatedScalarValuesMessage'));
            let m = fixtures.getMessage('spec.RepeatedScalarValuesMessage', 'example');
            m.doubleField = "str";

            let is = check.is(m, depth, false);
            expect(is).toBe(false);

            m.doubleField = ["str"];
            is = check.is(m, depth, false);
            expect(is).toBe(true);
        });

    });


    describe('with simple string field', function () {

        let check = new ReflectionTypeCheck({
            typeName: '.test.TestMessage',
            fields: [normalizeFieldInfo({kind: 'scalar', T: ScalarType.STRING, no: 1, name: 'field'})]
        });

        const checkAssignable = (arg: any) => check.is(arg, 16, true);
        const checkLiteral = (arg: any) => check.is(arg, 16, false);

        it('requires property', () => {
            const is = checkLiteral({});
            expect(is).toBeFalse();
        });

        it('requires scalar value type', () => {
            const is = checkLiteral({field: 123});
            expect(is).toBeFalse();
        });

        it('recognizes scalar value', () => {
            const is = checkLiteral({field: "hello"});
            expect(is).toBeTrue();
        });

        it('ignores unknown property', () => {
            const is = checkAssignable({field: "string", extra: 123});
            expect(is).toBeTrue();
        });

        it('checkLiteral() rejects unknown property', () => {
            const is = checkLiteral({field: "string", extra: 123});
            expect(is).toBeFalse();
        });

    });

});
