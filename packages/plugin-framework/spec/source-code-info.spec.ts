import {DescriptorProto, FileDescriptorProto, makeSourceCodePathComponent} from "../src/";

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

