import {assert, isOneofGroup, normalizeFieldInfo, PartialMessage, ReflectionTypeCheck, ScalarType} from "@protobuf-ts/runtime";
import {ScalarValuesMessage} from "../ts-out/msg-scalar";


describe('ReflectionTypeCheck.is()', function () {

    // describe('accepts all fixture messages', function () {
    //     fixtures.usingMessages((typeName, key, msg) => {
    //         it(`${typeName} '${key}'`, function () {
    //             let check = new ReflectionTypeCheck(fixtures.makeMessageInfo(typeName));
    //             let is = check.is(msg, 16, false);
    //             expect(is).toBe(true);
    //         });
    //     });
    // });


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

        describe("scalar values message", () => {
            const mi = {
                typeName: ScalarValuesMessage.typeName,
                fields: ScalarValuesMessage.fields.map(normalizeFieldInfo),
                options: {}
            };
            let m = {
                doubleField: 0,
                floatField: 0,
                int64Field: "0",
                uint64Field: "0",
                int32Field: 0,
                fixed64Field: "0",
                fixed32Field: 0,
                boolField: false,
                stringField: "",
                bytesField: new Uint8Array(0),
                uint32Field: 0,
                sfixed32Field: 0,
                sfixed64Field: "0",
                sint32Field: 0,
                sint64Field: "0",
            } as PartialMessage<ScalarValuesMessage>;

            it('detects missing field', function () {
                let check = new ReflectionTypeCheck(mi);
                delete m['doubleField'];
                let is = check.is(m, 0, false);
                expect(is).toBe(false);
            });
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
