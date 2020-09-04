import {isOneofGroup} from "../src";


describe('isOneofGroup()', function () {

    it('returns true for case "none"', () => {
        expect(isOneofGroup({
            oneofKind: undefined
        })).toBeTrue();
    });

    it('returns true for a valid case', () => {
        expect(isOneofGroup({
            oneofKind: "error",
            error: "error message"
        })).toBeTrue();
    });

    it('returns false if discriminator is missing', () => {
        expect(isOneofGroup({
            foo: 123
        })).toBeFalse();
    });

    it('returns false if discriminator is not a string', () => {
        expect(isOneofGroup({
            oneofKind: true,
            true: 123
        })).toBeFalse();
    });

    it('returns false if discriminator points to a missing property', () => {
        expect(isOneofGroup({
            oneofKind: "error",
            foo: 123
        })).toBeFalse();
    });

    it('returns false if case "none" has extra properties', () => {
        expect(isOneofGroup({
            oneofKind: undefined,
            foo: 123
        })).toBeFalse();
    });

    it('returns false if valid case has extra properties', () => {
        expect(isOneofGroup({
            oneofKind: "error",
            error: "error message",
            foo: 123
        })).toBeFalse();
    });

});

