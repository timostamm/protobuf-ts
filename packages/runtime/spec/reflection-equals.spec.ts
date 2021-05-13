import {fixtures} from "../../test-fixtures";
import {normalizeFieldInfo, reflectionCreate, reflectionMergePartial, reflectionEquals, ScalarType} from "../src";


enum TestEnum {
    A = 0,
    B = 1,
    C = 2,
}


describe('reflectionEquals()', function () {


    beforeEach(function () {
        jasmine.addCustomEqualityTester((a, b) =>
            (a instanceof Uint8Array && b instanceof Uint8Array) ? a.byteLength === b.byteLength : undefined
        );
    });


    it('should return true for same instance', function () {
        let eq = reflectionEquals({typeName: "test", fields: [], options: {}}, {}, {});
        expect(eq).toBeTrue();
    });

    it('should return true for undefined, undefined', function () {
        let eq = reflectionEquals({typeName: "test", fields: [], options: {}}, undefined, undefined);
        expect(eq).toBeTrue();
    });

    it('should return false for message, undefined', function () {
        let eq = reflectionEquals({typeName: "test", fields: [], options: {}}, {}, undefined);
        expect(eq).toBeFalse();
    });

    it('should return false for different scalar field value', function () {
        let eq = reflectionEquals({
            typeName: "test", fields: [
                normalizeFieldInfo({no: 1, name: "value", kind: "scalar", T: ScalarType.INT32}),
                normalizeFieldInfo({no: 2, name: "unit", kind: "enum", T: () => ["spec.TestEnum", TestEnum]})
            ], options: {}
        }, {
            unit: 1,
            value: 429,
        }, {
            unit: 1,
            value: 458,
        });
        expect(eq).toBeFalse();
    });

    it('should ignore excess properties', function () {
        let info = {typeName: "test", fields: [], options: {}};
        let eq = reflectionEquals(info, {x: 123}, {});
        expect(eq).toBeTrue();
    });

    it('should detect non-equal bytes fields', function () {
        let info = {
            typeName: "test",
            fields: [normalizeFieldInfo({no: 1, name: "bytes", kind: "scalar", T: ScalarType.BYTES})],
            options: {}
        };
        let a = {bytes: new Uint8Array([1, 2, 3])};
        let b = {bytes: new Uint8Array([4, 5, 6])};
        let c = {bytes: new Uint8Array([1, 2, 3])};
        expect(reflectionEquals(info, a, b)).toBeFalse();
        expect(reflectionEquals(info, a, c)).toBeTrue();
    });

    describe('should return true for all cloned fixture messages', function () {
        fixtures.usingMessages((typeName, key, msg) => {
            it(`${typeName} '${key}'`, function () {
                const info = fixtures.makeMessageInfo(typeName);
                let copy = reflectionCreate(info);
                reflectionMergePartial(info, copy, msg);
                let eq = reflectionEquals(info, msg, copy);
                expect(eq).toBeTrue();
            });
        });
    });

    describe('should behave like jasmine equality comparator for all fixture messages', function () {
        fixtures.usingMessages((typeName, key, msg) => {
            it(`${typeName} '${key}'`, function () {
                const info = fixtures.makeMessageInfo(typeName);
                let copy = reflectionCreate(info);
                reflectionMergePartial(info, copy, msg);
                let eq = reflectionEquals(info, msg, copy);
                if (eq)
                    expect(msg).toEqual(copy);
                else
                    expect(msg).not.toEqual(copy);
            });
        });
    });


});
