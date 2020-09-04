import {DescriptorProto, FieldDescriptorProto, visitDescriptorTree} from "../src/";
import {getFixtureFileDescriptor} from "./support/helpers";


describe('visitDescriptor()', function () {

    const scalarValuesProto = getFixtureFileDescriptor("msg-scalar.proto");


    it('visits messages', () => {
        const messageNames: string[] = [];
        visitDescriptorTree(scalarValuesProto, descriptor => {
            if (DescriptorProto.is(descriptor)) {
                messageNames.push(descriptor.name ?? '');
            }
        });
        expect(messageNames.length).toBe(2);
        expect(messageNames).toContain('ScalarValuesMessage');
        expect(messageNames).toContain('RepeatedScalarValuesMessage');
    });


    it('visits fields', () => {
        const fieldNames: string[] = [];
        visitDescriptorTree(scalarValuesProto, descriptor => {
            if (FieldDescriptorProto.is(descriptor)) {
                fieldNames.push(descriptor.name ?? '');
            }
        });
        expect(fieldNames.length).toBeGreaterThanOrEqual(28);
    });


    it('includes carry', () => {
        let messageCount = 0;
        let fieldCount = 0;

        visitDescriptorTree(scalarValuesProto, (descriptor, carry) => {
            if (DescriptorProto.is(descriptor)) {
                messageCount++;
                expect(carry.length).toBe(1);
                expect(carry[0]).toBe(scalarValuesProto);
            }
            if (FieldDescriptorProto.is(descriptor)) {
                fieldCount++;
                expect(carry.length).toBe(2);
                expect(carry[0]).toBe(scalarValuesProto);
                expect(DescriptorProto.is(carry[1])).toBeTrue();
            }
        });
        expect(messageCount).toBeGreaterThanOrEqual(1);
        expect(fieldCount).toBeGreaterThanOrEqual(1);
    });


});

