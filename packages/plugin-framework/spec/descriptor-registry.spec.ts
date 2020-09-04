import {getFixtureCodeGeneratorRequest, getFixtureFileDescriptor} from "./support/helpers";
import {DescriptorRegistry} from "../src";
import {DescriptorProto, FileDescriptorProto} from "../src";


describe('DescriptorRegistry', function () {

    it('can be created from FileDescriptorProto', () => {
        const file = getFixtureFileDescriptor("comments.proto");
        const registry = DescriptorRegistry.createFrom(file);
        expect(registry).toBeDefined();
        expect(registry.allFiles().length).toBeGreaterThanOrEqual(1);
    });

    it('can be created from CodeGeneratorRequest', () => {
        const request = getFixtureCodeGeneratorRequest({
            includeFiles: ["comments.proto"]
        });
        const registry = DescriptorRegistry.createFrom(request);
        expect(registry).toBeDefined();
        expect(registry.allFiles().length).toBeGreaterThanOrEqual(1);
    });

});


describe('DescriptorRegistry.resolveTypeName()', function () {

    const registry = DescriptorRegistry.createFrom(getFixtureFileDescriptor("comments.proto"));

    it('resolves message', () => {
        const message = registry.resolveTypeName('spec.MessageWithComments');
        expect(message).toBeDefined();
    });

    it('throws for unknown type', () => {
        expect(() => registry.resolveTypeName('spec.ThisTypeShouldNeverBeFound')).toThrow();
    });

});


describe('DescriptorRegistry.peekTypeName()', function () {

    const registry = DescriptorRegistry.createFrom(getFixtureFileDescriptor("comments.proto"));

    it('resolves message', () => {
        const message = registry.peekTypeName('spec.MessageWithComments');
        expect(message).toBeDefined();
    });

    it('does not throw for unknown type', () => {
        const message = registry.peekTypeName('spec.ThisTypeShouldNeverBeFound');
        expect(message).toBeUndefined();
    });

});


describe('DescriptorRegistry.ancestors()', function () {

    const registry = DescriptorRegistry.createFrom(getFixtureFileDescriptor("msg-nesting.proto"));
    const type = registry.resolveTypeName('spec.ParentMessage.ChildMessage.GrandChildMessage');

    it('returns ancestors up to file', () => {
        const ancestors = registry.ancestorsOf(type);
        expect(ancestors.length).toBe(3);
        expect(FileDescriptorProto.is(ancestors[0])).toBeTrue();
        if (DescriptorProto.is(ancestors[0])) {
            expect(ancestors[0].name).toBe('nested-messages.proto');
        }
        expect(DescriptorProto.is(ancestors[1])).toBeTrue();
        if (DescriptorProto.is(ancestors[1])) {
            expect(ancestors[1].name).toBe('ParentMessage');
        }
        expect(DescriptorProto.is(ancestors[2])).toBeTrue();
        if (DescriptorProto.is(ancestors[2])) {
            expect(ancestors[2].name).toBe('ChildMessage');
        }
    });

});

