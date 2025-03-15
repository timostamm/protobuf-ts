import {assert} from "@protobuf-ts/runtime";
import {MessageWithExcludedOptions} from "../gen/exclude-options";
import type {RpcTransport} from "@protobuf-ts/runtime-rpc";
import {ServiceWithExcludedOptionsClient} from "../gen/exclude-options.client";

// Copied from test-default/exclude-options.spec.ts. Do not edit.

describe('spec.MessageWithExcludedOptions', function () {

    const fi = MessageWithExcludedOptions.fields[0];
    assert(fi !== undefined);

    it('should not have option "spec.fld_opt1"', function () {
        expect(fi.options).toBeDefined();
        if (fi.options) {
            expect(fi.options["spec.fld_op1"]).toBeUndefined()
        }
    });

    it('should not have option "spec.fld_foo_*"', function () {
        expect(fi.options).toBeDefined();
        if (fi.options) {
            expect(fi.options["spec.fld_foo_bar"]).toBeUndefined()
            expect(fi.options["spec.fld_foo_baz"]).toBeUndefined()
        }
    });

    it('should have non-excluded options', function () {
        expect(fi.options).toBeDefined();
        if (fi.options) {
            expect(fi.options["spec.fld_foo"]).toBeTrue()
            expect(fi.options["spec.fld_opt2"]).toBeTrue()
        }
    });

});


describe('spec.ServiceWithExcludedOptions', function () {

    let client = new ServiceWithExcludedOptionsClient(null as unknown as RpcTransport);
    const mi = client.methods.find(mi => mi.name === "Test");
    assert(mi !== undefined);

    it('should not have option "spec.mtd_opt1"', function () {
        if (mi.options) {
            expect(mi.options["spec.mtd_op1"]).toBeUndefined()
        }
    });

    it('should not have option "spec.mtd_foo_*"', function () {
        expect(mi.options).toBeDefined();
        if (mi.options) {
            expect(mi.options["spec.mtd_foo_bar"]).toBeUndefined()
            expect(mi.options["spec.mtd_foo_baz"]).toBeUndefined()
        }
    });

    it('should have non-excluded options', function () {
        expect(mi.options).toBeDefined();
        if (mi.options) {
            expect(mi.options["spec.mtd_foo"]).toBeTrue()
            expect(mi.options["spec.mtd_opt2"]).toBeTrue()
        }
    });

});


