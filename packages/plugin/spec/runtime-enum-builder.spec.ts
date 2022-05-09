import {isEnumObject} from "@chippercash/protobuf-runtime";
import {RuntimeEnumBuilder} from "../src/interpreter";


describe('RuntimeEnumBuilder', function () {

    let builder: RuntimeEnumBuilder;

    beforeEach(function () {
        builder = new RuntimeEnumBuilder();
    })

    it('should throw error on empty build()', () => {
        expect(() => builder.build()).toThrowError();
        expect(builder.isValid()).toBeFalse();
    });

    it('should build() valid', () => {
        builder.add("UNSPECIFIED", 0);
        builder.add("YES", 1);
        builder.add("NO", 2);
        let eo = builder.build();
        expect(isEnumObject(eo)).toBeTrue();
        expect(builder.isValid()).toBeTrue();
        expect(eo["UNSPECIFIED"]).toBe(0);
        expect(eo["YES"]).toBe(1);
        expect(eo["NO"]).toBe(2);
        expect(eo[0]).toBe("UNSPECIFIED");
        expect(eo[1]).toBe("YES");
        expect(eo[2]).toBe("NO");
    });

    it('should throw on duplicate name', () => {
        builder.add("FOO", 0);
        builder.add("FOO", 1);
        expect(() => builder.build()).toThrowError();
        expect(builder.isValid()).toBeFalse();
    });

    it('should build() valid', () => {
        builder.add("UNSPECIFIED", 0);
        builder.add("YES", 1);
        builder.add("NO", 2);
        let eo = builder.build();
        expect(isEnumObject(eo)).toBeTrue();
        expect(builder.isValid()).toBeTrue();
        expect(eo["UNSPECIFIED"]).toBe(0);
        expect(eo["YES"]).toBe(1);
        expect(eo["NO"]).toBe(2);
        expect(eo[0]).toBe("UNSPECIFIED");
        expect(eo[1]).toBe("YES");
        expect(eo[2]).toBe("NO");
    });

});
