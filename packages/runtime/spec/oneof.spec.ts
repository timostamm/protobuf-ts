import {
    clearOneofValue,
    getOneofValue,
    getSelectedOneofValue,
    isOneofGroup,
    setOneofValue,
    UnknownOneofGroup
} from "../src";
import {setUnknownOneofValue} from "../src/oneof";


describe('isOneofGroup()', function () {

    it('returns true for case "none"', () => {
        expect(isOneofGroup({
            kind: undefined
        })).toBeTrue();
    });

    it('returns true for a valid case', () => {
        expect(isOneofGroup({
            kind: "error",
            value: "error message"
        })).toBeTrue();
    });

    it('returns false if discriminator is missing', () => {
        expect(isOneofGroup({
            foo: 123
        })).toBeFalse();
    });

    it('returns false if discriminator is not a string', () => {
        expect(isOneofGroup({
            kind: true,
            value: 123
        })).toBeFalse();
    });

    it('returns false if case "none" has extra properties', () => {
        expect(isOneofGroup({
            kind: undefined,
            foo: 123
        })).toBeFalse();
    });

    it('returns false if valid case has extra properties', () => {
        expect(isOneofGroup({
            kind: "error",
            value: "error message",
            foo: 123
        })).toBeFalse();
    });

});


type ExampleOneof =
    | { kind: "a"; value: string; }
    | { kind: "b"; value: number; }
    | { kind: "c"; value: boolean; }
    | { kind: undefined; value?: never };

type EmptyOneof =
    | { kind: undefined; value?: never };

describe('clearOneofValue()', function () {
    let exampleOneof: ExampleOneof;
    let emptyOneof: EmptyOneof;
    let unknownOneof: UnknownOneofGroup;
    beforeEach(() => {
        exampleOneof = {
            kind: "a",
            value: "x"
        };
        emptyOneof = {
            kind: undefined,
        };
        unknownOneof = {
            kind: "a",
            value: "x"
        };
    });

    it('clears empty oneof', () => {
        clearOneofValue(emptyOneof);
        expect(emptyOneof.kind).toBe(undefined);
        expect(isOneofGroup(emptyOneof)).toBeTrue();
    });

    it('clears example oneof', () => {
        clearOneofValue(exampleOneof);
        expect(exampleOneof.kind).toBe(undefined);
        expect(isOneofGroup(exampleOneof)).toBeTrue();
    });

    it('clears unknown oneof', () => {
        clearOneofValue(unknownOneof);
        expect(unknownOneof.kind).toBe(undefined);
        expect(isOneofGroup(unknownOneof)).toBeTrue();
    });

});

describe('setOneofValue()', function () {
    let exampleOneof: ExampleOneof;
    let emptyOneof: EmptyOneof;
    let unknownOneof: UnknownOneofGroup;
    beforeEach(() => {
        exampleOneof = {
            kind: "a",
            value: "x"
        };
        emptyOneof = {
            kind: undefined,
        };
        unknownOneof = {
            kind: "a",
            value: "x"
        };
    });

    it('sets example oneof value', () => {
        setOneofValue(exampleOneof, "b", 1);
        expect(exampleOneof.kind).toBe("b");
        if (exampleOneof.kind === "b") {
            expect(exampleOneof.value).toBe(1);
        }
        expect(isOneofGroup(exampleOneof)).toBeTrue();
    });

    it('sets example oneof other value', () => {
        setOneofValue(exampleOneof, "c", true);
        expect(exampleOneof.kind).toBe("c");
        if (exampleOneof.kind === "c") {
            expect(exampleOneof.value).toBeTrue()
        }
        expect(isOneofGroup(exampleOneof)).toBeTrue();
    });

    it('sets empty oneof value', () => {
        setOneofValue(emptyOneof, undefined);
        expect(emptyOneof.kind).toBe(undefined);
        expect(isOneofGroup(emptyOneof)).toBeTrue();
    });

});

describe('setUnknownOneofValue()', function () {
    let unknownOneof: UnknownOneofGroup;
    beforeEach(() => {
        unknownOneof = {
            kind: "a",
            value: "x"
        };
    });

    it('sets undefined', () => {
        setOneofValue(unknownOneof, undefined);
        expect(unknownOneof.kind).toBe(undefined);
        expect(isOneofGroup(unknownOneof)).toBeTrue();
    });

    it('sets defined', () => {
        setUnknownOneofValue(unknownOneof, "a", "x");
        expect(unknownOneof.kind).toBe("a");
        expect(unknownOneof["value"]).toBe("x");
        expect(isOneofGroup(unknownOneof)).toBeTrue();
    });

});


describe('getSelectedOneofValue()', function () {
    let exampleOneof: ExampleOneof;
    let emptyOneof: EmptyOneof;
    let unknownOneof: UnknownOneofGroup;
    beforeEach(() => {
        exampleOneof = {
            kind: "a",
            value: "x"
        };
        emptyOneof = {
            kind: undefined,
        };
        unknownOneof = {
            kind: "a",
            value: "x"
        };
    });

    it('returns example oneof value', () => {
        const val: string | number | boolean | undefined = getSelectedOneofValue(exampleOneof);
        expect(val).toBe("x");
        expect(isOneofGroup(exampleOneof)).toBeTrue();
    });

    it('returns empty oneof value', () => {
        const val: string | number | boolean | undefined = getSelectedOneofValue(emptyOneof);
        expect(val).toBeUndefined();
        expect(isOneofGroup(emptyOneof)).toBeTrue();
    });

    it('returns unknown oneof value', () => {
        const val: UnknownOneofGroup["value"] = getSelectedOneofValue(unknownOneof);
        expect(val).toBe("x");
        expect(isOneofGroup(emptyOneof)).toBeTrue();
    });

});


describe('getOneofValue()', function () {
    let exampleOneof: ExampleOneof;
    beforeEach(() => {
        exampleOneof = {
            kind: "a",
            value: "x"
        };
    });

    it('returns typed oneof value', () => {
        const a: string | undefined = getOneofValue(exampleOneof, "a");
        expect(a).toBe("x");

        const b: number | undefined = getOneofValue(exampleOneof, "b");
        expect(b).toBeUndefined();

        const c: boolean | undefined = getOneofValue(exampleOneof, "c");
        expect(c).toBeUndefined();
    });

});

