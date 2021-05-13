import {AnnotatedMessage, FieldUiBehaviour} from "../ts-out/msg-annotated";
import {readFieldOptions} from "@protobuf-ts/runtime";


describe('spec.AnnotatedMessage', function () {

    it ('should have message options', function() {
        expect(AnnotatedMessage.options).toEqual({ "spec.opt_example": true });
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
        let act = readFieldOptions(AnnotatedMessage, "userName", "spec.field_ui", FieldUiBehaviour);
        expect(act).toEqual(exp);
    });

});


