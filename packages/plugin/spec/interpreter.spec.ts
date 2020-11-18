import {getFixtureFileDescriptor} from "./support/helpers";
import {DescriptorRegistry} from "@protobuf-ts/plugin-framework";
import {Interpreter} from "../src/interpreter";
import * as rt from "@protobuf-ts/runtime";


describe('interpreter', function () {


    it('recognizes field option jstype = JS_NUMBER', function () {

        const registry = DescriptorRegistry.createFrom(getFixtureFileDescriptor("msg-longs.proto"));
        const interpreter = new Interpreter(registry, {
            normalLongType: rt.LongType.BIGINT,
            synthesizeEnumZeroValue: 'UNSPECIFIED$',
            oneofKindDiscriminator: 'oneofKind',
        });
        const messageType = interpreter.getMessageType('spec.LongsMessage');

        const field = messageType.fields.find(f => f.name === 'fixed64_field_min_num');
        expect(field).toBeDefined();
        expect(field!.kind).toBe("scalar");
        if (field && field.kind === "scalar") {

            expect(field.L).toBe(rt.LongType.NUMBER);

        }

    });


});

