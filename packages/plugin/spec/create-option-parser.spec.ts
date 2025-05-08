import {createOptionParser} from "../src/framework/create-option-parser";

describe('createOptionParser()', function () {
    it('should accept empty spec', () => {
        const parse = createOptionParser({});
        expect(parse).toBeDefined();
    });
    describe('with invalid spec', () => {
        it('should raise error for bad "requires"', () => {
            const spec = {
                a: {
                    kind: "flag",
                    description: "a",
                    requires: ["b"],
                },
            } as const;
            expect(() => createOptionParser(spec)).toThrowError(/Invalid parameter spec for parameter "a"/);
        });
        it('should raise error for bad "excludes"', () => {
            const spec = {
                a: {
                    kind: "flag",
                    description: "a",
                    excludes: ["b"],
                },
            } as const;
            expect(() => createOptionParser(spec)).toThrowError(/Invalid parameter spec for parameter "a"/);
        });
    });
    describe("returned parser", () => {
        it('should parse raw options', () => {
            const parse = createOptionParser({
                a: {
                    kind: "flag",
                    description: "a",
                },
                b: {
                    kind: "flag",
                    description: "b",
                },
            });
            const opt = parse([{key: "a", value: ""}]);
            expect(opt.a).toBe(true);
            expect(opt.b).toBe(false);
        });
        it('should parse parameter string', () => {
            const parse = createOptionParser({
                a: {
                    kind: "flag",
                    description: "a",
                },
                b: {
                    kind: "flag",
                    description: "b",
                },
            });
            const opt = parse("a");
            expect(opt.a).toBe(true);
            expect(opt.b).toBe(false);
        });
        it('should error for unknown option', () => {
            const parse = createOptionParser({});
            const raw = [{key: "a", value: ""}];
            expect(() => parse(raw)).toThrowError(/Option "a" not recognized/);
        });
        it('should error for flag given twice', () => {
            const parse = createOptionParser({
                a: {
                    kind: "flag",
                    description: "a",
                },
            });
            const raw = [{key: "a", value: ""}, {key: "a", value: ""}];
            expect(() => parse(raw)).toThrowError(/Option "a" cannot be given more than once/);
        });
        it('should error for flag with value', () => {
            const parse = createOptionParser({
                a: {
                    kind: "flag",
                    description: "a",
                },
            });
            const raw = [{key: "a", value: "b"}];
            expect(() => parse(raw)).toThrowError(/Option "a" does not take a value/);
        });
        it('should error for violated "requires"', () => {
            const parse = createOptionParser({
                a: {
                    kind: "flag",
                    description: "a",
                    requires: ["b"],
                },
                b: {
                    kind: "flag",
                    description: "b",
                },
            });
            const raw = [{key: "a", value: ""}];
            expect(() => parse(raw)).toThrowError(/Option "a" requires option "b"/);
        });
        it('should error for violated "excludes"', () => {
            const parse = createOptionParser({
                a: {
                    kind: "flag",
                    description: "a",
                    excludes: ["b"],
                },
                b: {
                    kind: "flag",
                    description: "b",
                },
            });
            const raw = [{key: "a", value: ""}, {key: "b", value: ""}];
            expect(() => parse(raw)).toThrowError(/If option "a" is set, option "b" cannot be set/);
        });
    });
});
