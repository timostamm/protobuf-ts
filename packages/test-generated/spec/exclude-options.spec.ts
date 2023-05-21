import { assert } from "@protobuf-ts/runtime";
import type { RpcTransport } from "@protobuf-ts/runtime-rpc";
import { MessageWithExcludedOptions as MessageWithExcludedOptions_Speed } from "../ts-out/speed/exclude-options";
import { MessageWithExcludedOptions as MessageWithExcludedOptions_Size } from "../ts-out/size/exclude-options";
import { MessageWithExcludedOptions as MessageWithExcludedOptions_SpeedBigInt } from "../ts-out/speed-bigint/exclude-options";
import { MessageWithExcludedOptions as MessageWithExcludedOptions_SizeBigInt } from "../ts-out/size-bigint/exclude-options";
import { ServiceWithExcludedOptionsClient as ServiceWithExcludedOptionsClient_Speed } from "../ts-out/speed/exclude-options.client";
import { ServiceWithExcludedOptionsClient as ServiceWithExcludedOptionsClient_Size } from "../ts-out/size/exclude-options.client";
import { ServiceWithExcludedOptionsClient as ServiceWithExcludedOptionsClient_SpeedBigInt } from "../ts-out/speed-bigint/exclude-options.client";
import { ServiceWithExcludedOptionsClient as ServiceWithExcludedOptionsClient_SizeBigInt } from "../ts-out/size-bigint/exclude-options.client";

describe("spec.MessageWithExcludedOptions", function () {
  const msgs = {
    speed: MessageWithExcludedOptions_Speed,
    size: MessageWithExcludedOptions_Size,
    speedBigInt: MessageWithExcludedOptions_SpeedBigInt,
    sizeBigInt: MessageWithExcludedOptions_SizeBigInt,
  };

  Object.entries(msgs).forEach(([name, messageType]) => {
    describe(name, () => {
      const fi = messageType.fields[0];
      assert(fi !== undefined);

      it('should not have option "spec.fld_opt1"', function () {
        expect(fi.options).toBeDefined();
        if (fi.options) {
          expect(fi.options["spec.fld_op1"]).toBeUndefined();
        }
      });

      it('should not have option "spec.fld_foo_*"', function () {
        expect(fi.options).toBeDefined();
        if (fi.options) {
          expect(fi.options["spec.fld_foo_bar"]).toBeUndefined();
          expect(fi.options["spec.fld_foo_baz"]).toBeUndefined();
        }
      });

      it("should have non-excluded options", function () {
        expect(fi.options).toBeDefined();
        if (fi.options) {
          expect(fi.options["spec.fld_foo"]).toBeTrue();
          expect(fi.options["spec.fld_opt2"]).toBeTrue();
        }
      });
    });
  });
});

describe("spec.ServiceWithExcludedOptions", function () {
  const msgs = {
    speed: ServiceWithExcludedOptionsClient_Speed,
    size: ServiceWithExcludedOptionsClient_Size,
    speedBigInt: ServiceWithExcludedOptionsClient_SpeedBigInt,
    sizeBigInt: ServiceWithExcludedOptionsClient_SizeBigInt,
  };

  Object.entries(msgs).forEach(([name, clientType]) => {
    describe(name, () => {
      let client = new clientType(null as unknown as RpcTransport);
      const mi = client.methods.find((mi) => mi.name === "Test");
      assert(mi !== undefined);

      it('should not have option "spec.mtd_opt1"', function () {
        if (mi.options) {
          expect(mi.options["spec.mtd_op1"]).toBeUndefined();
        }
      });

      it('should not have option "spec.mtd_foo_*"', function () {
        expect(mi.options).toBeDefined();
        if (mi.options) {
          expect(mi.options["spec.mtd_foo_bar"]).toBeUndefined();
          expect(mi.options["spec.mtd_foo_baz"]).toBeUndefined();
        }
      });

      it("should have non-excluded options", function () {
        expect(mi.options).toBeDefined();
        if (mi.options) {
          expect(mi.options["spec.mtd_foo"]).toBeTrue();
          expect(mi.options["spec.mtd_opt2"]).toBeTrue();
        }
      });
    });
  });
});
