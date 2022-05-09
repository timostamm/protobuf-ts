import {getFixtureFileDescriptor} from "./support/helpers";
import {
    DescriptorParentFn,
    DescriptorProto,
    DescriptorRegistry,
    FileDescriptorProto,
    filterSourceCodeLocations,
    makeSourceCodePath,
    makeSourceCodePathComponent,
    sourceCodeLocationToComment,
    sourceCodeLocationToCursor
} from "../src/";
import {assert} from "@chippercash/protobuf-runtime";

const pathTo_MessageWithComments_Foo = [4, 0, 2, 0];
const cursor_MessageWithComments_Foo = [28, 5];


describe('sourceCodeLocationToComment()', function () {
    const all = getFixtureFileDescriptor("comments.proto").sourceCodeInfo?.location ?? [];
    const locations = filterSourceCodeLocations(all, pathTo_MessageWithComments_Foo);
    it('seems to recognize comments correctly', function () {
        const comments = sourceCodeLocationToComment(locations);
        expect(comments.leadingDetached.length).toBe(1);
        expect(comments.leading).toBeDefined();
        expect(comments.trailing).toBeDefined();
    });
});


describe('sourceCodeLocationToCursor()', function () {
    const all = getFixtureFileDescriptor("comments.proto").sourceCodeInfo?.location ?? [];
    const locations = filterSourceCodeLocations(all, pathTo_MessageWithComments_Foo);
    it('returns expected cursor', function () {
        const cursor = sourceCodeLocationToCursor(locations);
        expect(cursor).toEqual(cursor_MessageWithComments_Foo);
    });
});


describe('makeSourceCodePath()', function () {
    const registry = DescriptorRegistry.createFrom(getFixtureFileDescriptor("comments.proto"));
    const parents: DescriptorParentFn = d => registry.parentOf(d);
    const message = registry.resolveTypeName('spec.MessageWithComments');
    assert(DescriptorProto.is(message));
    const field = message.field[0];
    it('returns expected path', function () {
        const path = makeSourceCodePath(parents, field);
        expect(path).toEqual(pathTo_MessageWithComments_Foo);
    });
});


describe('makeSourceCodePathComponent()', function () {
    it('returns undefined for unknown combination ', () => {
        const file = FileDescriptorProto.create();
        const component = makeSourceCodePathComponent(file, file);
        expect(component).toBeUndefined();
    });
    it('returns component for known combination', () => {
        const file = FileDescriptorProto.create();
        const message = DescriptorProto.create();
        file.messageType.push(message);
        const component = makeSourceCodePathComponent(file, message);
        expect(component).toBeDefined();
    });
});
