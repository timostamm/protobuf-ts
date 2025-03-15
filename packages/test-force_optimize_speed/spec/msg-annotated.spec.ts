import {AnnotatedMessage, FieldUiBehaviour} from "../gen/msg-annotated";
import {readFieldOption, readMessageOption} from "@protobuf-ts/runtime";

// Copied from test-default/msg-annotated.spec.ts. Do not edit.

describe('readFieldOption', function () {
    it('should read scalar opt', function () {
        let act = readFieldOption(AnnotatedMessage, "annScalar", "spec.opt_string");
        expect(act).toBe('my string');
    });
    it('should read message opt', function () {
        let act = readFieldOption(AnnotatedMessage, "userName", "spec.field_ui");
        expect(act).toEqual({
            label: "User name",
            required: true,
            autocomplete: {
                serviceName: "example.SomeService",
                methodName: "autocompleteUsername",
                requestFieldName: "entered_text"
            }
        });
    });
    it('should read message opt with type', function () {
        let act = readFieldOption(AnnotatedMessage, "userName", "spec.field_ui", FieldUiBehaviour);
        expect(act).toEqual({
            label: "User name",
            required: true,
            autocomplete: {
                serviceName: "example.SomeService",
                methodName: "autocompleteUsername",
                requestFieldName: "entered_text"
            }
        });
    });
});

describe('readMessageOption', function () {
    it('should read scalar opt', function () {
        let act = readMessageOption(AnnotatedMessage, "spec.opt_example");
        expect(act).toBe(true);
    });
});

describe('spec.AnnotatedMessage', function () {

    it('should have message option "spec.opt_example"', function () {
        expect(AnnotatedMessage.options).toBeDefined();
        if (AnnotatedMessage.options) {
            expect(AnnotatedMessage.options["spec.opt_example"]).toBeTrue();
        }
    });

    it('field ann_scalar should have scalar options', function () {
        let fi = AnnotatedMessage.fields.find(fi => fi.name === "ann_scalar");
        expect(fi).toBeDefined();
        if (fi) {
            expect(fi.options).toBeDefined();
            if (fi.options) {
                expect(fi.options['spec.opt_bool']).toBe(true);
                expect(fi.options['spec.opt_uint32']).toBe(123);
                expect(fi.options['spec.opt_uint64']).toBe("123456");
                expect(fi.options['spec.opt_string']).toBe("my string");
            }
        }
    });

    it('field ann_repeated_scalar should have repeated scalar options', function () {
        let fi = AnnotatedMessage.fields.find(fi => fi.name === "ann_repeated_scalar");
        expect(fi).toBeDefined();
        if (fi) {
            expect(fi.options).toBeDefined();
            if (fi.options) {
                expect(fi.options['spec.opt_repeated_bool']).toEqual([true, false]);
                expect(fi.options['spec.opt_repeated_uint32']).toEqual([123, 456]);
                expect(fi.options['spec.opt_repeated_uint64']).toEqual(["123456", "789101112"]);
                expect(fi.options['spec.opt_repeated_string']).toEqual(["hello...", "...world"]);
            }
        }
    });

    it('field ann_enum should have enum option', function () {
        let fi = AnnotatedMessage.fields.find(fi => fi.name === "ann_enum");
        expect(fi).toBeDefined();
        if (fi) {
            expect(fi.no).toBe(5);
            expect(fi.options).toBeDefined();
            if (fi.options) {
                expect(fi.options['spec.opt_enum']).toEqual("OPTION_ENUM_YES");
            }
        }
    });

    it('field ann_enum_zero should have enum option', function () {
        let fi = AnnotatedMessage.fields.find(fi => fi.name === "ann_enum_zero");
        expect(fi).toBeDefined();
        if (fi) {
            expect(fi.options).toBeDefined();
            if (fi.options) {
                expect(fi.options['spec.opt_enum']).toEqual("OPTION_ENUM_UNSPECIFIED");
            }
        }
    });

    it('field ann_repeated_enum should have repeated enum option', function () {
        let fi = AnnotatedMessage.fields.find(fi => fi.name === "ann_repeated_enum");
        expect(fi).toBeDefined();
        if (fi) {
            expect(fi.options).toBeDefined();
            if (fi.options) {
                expect(fi.options['spec.opt_repeated_enum']).toEqual(["OPTION_ENUM_YES", "OPTION_ENUM_NO"]);
            }
        }
    });

    it('field not_annotated should have no options', function () {
        let fi = AnnotatedMessage.fields.find(fi => fi.name === "not_annotated");
        expect(fi).toBeDefined();
        if (fi) {
            expect(fi.options).toBeUndefined();
        }
    });

    it('field user_name should have message option', function () {
        let exp = {
            label: "User name",
            required: true,
            autocomplete: {
                serviceName: "example.SomeService",
                methodName: "autocompleteUsername",
                requestFieldName: "entered_text"
            }
        };
        let act = AnnotatedMessage.fields.find(fi => fi.name === 'user_name')?.options?.['spec.field_ui'];
        expect(act).toEqual(exp);
    });

});


