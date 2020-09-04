import {isEnumObject, listEnumNames, listEnumNumbers, listEnumValues} from "../src";

enum EnumWithAlias { ANY = 0, YES = 1, YEAH = 1 }
enum StringEnum { ANY = 0, YES = "YES" }
enum No0Enum { YES = 1 }


describe('isEnumObject()', function () {

    it('works with enum aliases', () => {

        expect(isEnumObject(EnumWithAlias)).toBeTrue();
    });

    it('rejects string enum', () => {

        expect(isEnumObject(StringEnum)).toBeFalse();
    });

    it('rejects missing 0', () => {

        expect(isEnumObject(No0Enum)).toBeFalse();
    });

});


describe('listEnumValues()', function () {

    it('works with enum aliases', () => {

        let expected: any = [
            {name: "ANY", number: 0},
            {name: "YES", number: 1},
            {name: "YEAH", number: 1},
        ];
        expect(listEnumValues(EnumWithAlias)).toEqual(expected);
    });

    it('throws for string enum', () => {
        expect(() => listEnumValues(StringEnum)).toThrowError();
    });

    it('throws for enum without 0', () => {
        expect(() => listEnumValues(StringEnum)).toThrowError();
    });

});



describe('listEnumNumbers()', function () {

    it('works with enum aliases', () => {
        let expected: any = [0, 1];
        expect(listEnumNumbers(EnumWithAlias)).toEqual(expected);
    });

});



describe('listEnumNames()', function () {

    it('works with enum aliases', () => {
        let expected: any = ["ANY", "YES", "YEAH"];
        expect(listEnumNames(EnumWithAlias)).toEqual(expected);
    });

});


