import {getFixtureFileDescriptor} from "./support/helpers";
import {DescriptorRegistry} from "@protobuf-ts/plugin-framework";
import {Interpreter, reservedObjectProperties, reservedClassProperties} from "../src/interpreter";
import * as rt from "@protobuf-ts/runtime";


describe('interpreter', function () {
    it('recognizes field option jstype', function () {
        [rt.LongType.NUMBER, rt.LongType.STRING, rt.LongType.BIGINT].forEach(normalLongType => {

            const registry = DescriptorRegistry.createFrom(getFixtureFileDescriptor("msg-longs.proto"));
            const interpreter = new Interpreter(registry, {
                normalLongType,
                synthesizeEnumZeroValue: 'UNSPECIFIED$',
                oneofKindDiscriminator: 'kind',
                forceExcludeAllOptions: false,
                keepEnumPrefix: false,
                useProtoFieldName: false,
            });
            const messageType = interpreter.getMessageType('spec.LongsMessage');

            expectFieldType(messageType, 'sfixed64_field_min', normalLongType);
            expectFieldType(messageType, 'fixed64_field_min_num', rt.LongType.NUMBER);
            expectFieldType(messageType, 'fixed64_field_min_str', rt.LongType.STRING);
            expectFieldType(messageType, 'fixed64_field_min', rt.LongType.BIGINT);
        });
    });

    describe('name clashes', function () {
        const registry = DescriptorRegistry.createFrom(getFixtureFileDescriptor("name-clash.proto"));
        const interpreter = new Interpreter(registry, {
            normalLongType: rt.LongType.NUMBER,
            synthesizeEnumZeroValue: 'UNSPECIFIED$',
            oneofKindDiscriminator: 'kind',
            forceExcludeAllOptions: false,
            keepEnumPrefix: false,
            useProtoFieldName: false,
        });

        it('ReservedFieldNames is escaped', function () {
            const messageType = interpreter.getMessageType('spec.ReservedFieldNames');
            messageType.fields.forEach((field) => {
                expect(reservedObjectProperties.has(field.localName)).toBeFalse();
            });
            expect(getLocalName(messageType, 'kind')).toBe('kind');
        });

        it('ReservedFieldNamesInOneof is escaped', function () {
            const messageType = interpreter.getMessageType('spec.ReservedFieldNamesInOneof');
            messageType.fields.forEach((field) => {
                expect(reservedObjectProperties.has(field.localName)).toBeFalse();
            });
            expect(getLocalName(messageType, 'kind')).toBe('kind');
        });

        it('NameClashService is escaped', function () {
            const serviceType = interpreter.getServiceType('spec.NameClashService');
            serviceType.methods.forEach((field) => {
                expect(reservedClassProperties.has(field.localName)).toBeFalse();
            });
        })

        describe('oneof descriminator kind', function () {
            it('is escaped in OneofDiscriminatorClash', function () {
                const messageType = interpreter.getMessageType('spec.OneofDiscriminatorClash');
                expect(getLocalName(messageType, 'kind')).toBe('kind$');
            });
    
            it('is escaped in OneofDiscriminatorClashInOneof', function () {
                const messageType = interpreter.getMessageType('spec.OneofDiscriminatorClashInOneof');
                expect(getLocalName(messageType, 'kind')).toBe('kind$');
            });

            it('is escaped in OneofDiscriminatorClashNumber', function () {
                const messageType = interpreter.getMessageType('spec.OneofDiscriminatorClashNumber');
                expect(getLocalName(messageType, 'kind')).toBe('kind$');
            });

            it('is NOT escaped in NoOneofDiscriminatorClashNumber', function () {
                const messageType = interpreter.getMessageType('spec.NoOneofDiscriminatorClashNumber');
                expect(getLocalName(messageType, 'kind')).toBe('kind');
            });

            it('is NOT escaped in NoOneofDiscriminatorClashRepeated', function () {
                const messageType = interpreter.getMessageType('spec.NoOneofDiscriminatorClashRepeated');
                expect(getLocalName(messageType, 'kind')).toBe('kind');
            });
        })
    });
});

// Expect to find a scalar field `name` of type `type`.
function getLocalName(messageType: rt.IMessageType<rt.UnknownMessage>, name: string) {
    const field = messageType.fields.find(f => f.name === name);
    expect(field).toBeDefined();
    return field!.localName;
}

// Expect to find a scalar field `name` of type `type`.
function expectFieldType(messageType: rt.IMessageType<rt.UnknownMessage>, name: string, type: rt.LongType) {
    const field = messageType.fields.find(f => f.name === name);
    expect(field).toBeDefined();
    expect(field!.kind).toBe("scalar");
    if (field && field.kind === "scalar") {
        expect(field.L ?? rt.LongType.STRING).toBe(type);
    }
}
