import {clearOneofValue, getOneofValue, isOneofGroup, setOneofValue, UnknownOneofGroup} from "../src";


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


type ExampleOneof =
    | { oneofKind: "a"; a: string; }
    | { oneofKind: "b"; b: number; }
    | { oneofKind: "c"; c: boolean; }
    | { oneofKind: undefined; };

type EmptyOneof =
    | { oneofKind: undefined; };


describe('clearOneofValue()', function () {
    let exampleOneof: ExampleOneof;
    let emptyOneof: EmptyOneof;
    let unknownOneof: UnknownOneofGroup;
    beforeEach(() => {
        exampleOneof = {
            oneofKind: "a",
            a: "x"
        };
        emptyOneof = {
            oneofKind: undefined,
        };
        unknownOneof = {
            oneofKind: "a",
            a: "x"
        };
    });

    it('clears empty oneof', () => {
        clearOneofValue(emptyOneof);
        expect(emptyOneof.oneofKind).toBe(undefined);
        expect(isOneofGroup(emptyOneof)).toBeTrue();
    });

    it('clears example oneof', () => {
        clearOneofValue(exampleOneof);
        expect(exampleOneof.oneofKind).toBe(undefined);
        expect(isOneofGroup(exampleOneof)).toBeTrue();
    });

    it('clears unknown oneof', () => {
        clearOneofValue(unknownOneof);
        expect(unknownOneof.oneofKind).toBe(undefined);
        expect(isOneofGroup(unknownOneof)).toBeTrue();
    });

});

describe('setOneofValue()', function () {
    let exampleOneof: ExampleOneof;
    let emptyOneof: EmptyOneof;
    let unknownOneof: UnknownOneofGroup;
    beforeEach(() => {
        exampleOneof = {
            oneofKind: "a",
            a: "x"
        };
        emptyOneof = {
            oneofKind: undefined,
        };
        unknownOneof = {
            oneofKind: "a",
            a: "x"
        };
    });

    it('sets example oneof value', () => {
        setOneofValue(exampleOneof, "b", 1);
        expect(exampleOneof.oneofKind).toBe("b");
        if (exampleOneof.oneofKind === "b") {
            expect(exampleOneof.b).toBe(1);
        }
        expect(isOneofGroup(exampleOneof)).toBeTrue();
    });

    it('sets example oneof other value', () => {
        setOneofValue(exampleOneof, "c", true);
        expect(exampleOneof.oneofKind).toBe("c");
        if (exampleOneof.oneofKind === "c") {
            expect(exampleOneof.c).toBeTrue()
        }
        expect(isOneofGroup(exampleOneof)).toBeTrue();
    });

    it('sets empty oneof value', () => {
        setOneofValue(emptyOneof, undefined);
        expect(emptyOneof.oneofKind).toBe(undefined);
        expect(isOneofGroup(emptyOneof)).toBeTrue();
    });

    it('sets unknown oneof value', () => {
        setOneofValue(unknownOneof, undefined);
        expect(unknownOneof.oneofKind).toBe(undefined);
        expect(isOneofGroup(unknownOneof)).toBeTrue();
    });

});

describe('getOneofValue()', function () {
    let exampleOneof: ExampleOneof;
    let emptyOneof: EmptyOneof;
    let unknownOneof: UnknownOneofGroup;
    beforeEach(() => {
        exampleOneof = {
            oneofKind: "a",
            a: "x"
        };
        emptyOneof = {
            oneofKind: undefined,
        };
        unknownOneof = {
            oneofKind: "a",
            a: "x"
        };
    });

    it('returns example oneof value', () => {
        const val: string | number | boolean | undefined = getOneofValue(exampleOneof);
        expect(val).toBe("x");
        expect(isOneofGroup(exampleOneof)).toBeTrue();
    });

    it('returns empty oneof value', () => {
        const val: string | number | boolean | undefined = getOneofValue(emptyOneof);
        expect(val).toBeUndefined();
        expect(isOneofGroup(emptyOneof)).toBeTrue();
    });

    it('returns unknown oneof value', () => {
        const val: UnknownOneofGroup[string] = getOneofValue(unknownOneof);
        expect(val).toBe("x");
        expect(isOneofGroup(emptyOneof)).toBeTrue();
    });

});

