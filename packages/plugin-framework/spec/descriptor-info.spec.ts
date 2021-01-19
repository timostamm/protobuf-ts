import {
    DescriptorInfo,
    DescriptorProto,
    DescriptorTree,
    EnumDescriptorProto,
    FieldDescriptorProto_Type,
    FileDescriptorProto,
    ServiceDescriptorProto,
    TypeNameLookup
} from "../src";


describe('isTypeUsed()', function () {

    const
        messageA = DescriptorProto.create({
            name: "MessageA",
            field: [{
                name: "foo",
                jsonName: "foo",
                number: 0,
                type: FieldDescriptorProto_Type.BOOL,
            }]
        }),
        enumA = EnumDescriptorProto.create({
            name: "EnumA",
            value: [{
                number: 0,
                name: "UNSPECIFIED"
            }],
        }),
        serviceUsingMessageA = ServiceDescriptorProto.create({
            name: "ServiceUsingMessageA",
            method: [{
                name: "Foo",
                inputType: ".MessageA",
                outputType: ".MessageA"
            }]
        }),
        messageUsingMessageA = DescriptorProto.create({
            name: "MessageUsingMessageA",
            field: [{
                name: "foo",
                jsonName: "foo",
                number: 0,
                type: FieldDescriptorProto_Type.MESSAGE,
                typeName: ".MessageA"
            }]
        }),
        messageUsingEnumA = DescriptorProto.create({
            name: "MessageUsingEnumA",
            field: [{
                name: "foo",
                jsonName: "foo",
                number: 0,
                type: FieldDescriptorProto_Type.ENUM,
                typeName: ".EnumA"
            }]
        }),
        fileDeclareMessageA: FileDescriptorProto = {
            name: "message-a.proto",
            messageType: [messageA],
            dependency: [],
            service: [],
            enumType: [],
            syntax: "proto3",
            extension: [],
            options: undefined,
            package: undefined,
            publicDependency: [],
            sourceCodeInfo: undefined,
            weakDependency: []
        },
        fileDeclareEnumA: FileDescriptorProto = {
            name: "enum-a.proto",
            enumType: [enumA],
            dependency: [],
            service: [],
            messageType: [],
            syntax: "proto3",
            extension: [],
            options: undefined,
            package: undefined,
            publicDependency: [],
            sourceCodeInfo: undefined,
            weakDependency: []
        },
        fileServiceUseMessageA: FileDescriptorProto = {
            dependency: ["message-a.proto"],
            name: "service-use-message-a.proto",
            service: [serviceUsingMessageA],
            messageType: [],
            enumType: [],
            syntax: "proto3",
            extension: [],
            options: undefined,
            package: undefined,
            publicDependency: [],
            sourceCodeInfo: undefined,
            weakDependency: []
        },
        fileMessageUseMessageA: FileDescriptorProto = {
            dependency: ["message-a.proto"],
            name: "message-use-message-a.proto",
            service: [],
            messageType: [messageUsingMessageA],
            enumType: [],
            syntax: "proto3",
            extension: [],
            options: undefined,
            package: undefined,
            publicDependency: [],
            sourceCodeInfo: undefined,
            weakDependency: []
        },
        fileMessageUsingEnumA: FileDescriptorProto = {
            dependency: ["enum-a.proto"],
            name: "message-use-enum-a.proto",
            service: [],
            messageType: [messageUsingEnumA],
            enumType: [],
            syntax: "proto3",
            extension: [],
            options: undefined,
            package: undefined,
            publicDependency: [],
            sourceCodeInfo: undefined,
            weakDependency: []
        },
        tree = DescriptorTree.from(fileDeclareMessageA, fileDeclareEnumA, fileServiceUseMessageA, fileMessageUseMessageA, fileMessageUsingEnumA),
        info = new DescriptorInfo(tree, TypeNameLookup.from(tree));

    it('should return false for unused message', function () {
        const used = info.isTypeUsed(messageA, [fileDeclareEnumA, fileMessageUsingEnumA]);
        expect(used).toBeFalse();
    });

    it('should return false for unused enum', function () {
        const used = info.isTypeUsed(enumA, [fileDeclareMessageA, fileMessageUseMessageA, fileServiceUseMessageA]);
        expect(used).toBeFalse();
    });

    it('should return false for unused service', function () {
        const used = info.isTypeUsed(serviceUsingMessageA, [fileDeclareMessageA, fileDeclareEnumA, fileMessageUsingEnumA]);
        expect(used).toBeFalse();
    });

    it('should return true for message used in message', function () {
        const used = info.isTypeUsed(messageA, [fileMessageUseMessageA]);
        expect(used).toBeTrue();
    });

    it('should return true for message used in service', function () {
        const used = info.isTypeUsed(messageA, [fileServiceUseMessageA]);
        expect(used).toBeTrue();
    });

    it('should return true for enum used in message', function () {
        const used = info.isTypeUsed(enumA, [fileMessageUsingEnumA]);
        expect(used).toBeTrue();
    });

    it('should return false for message in declaring file', function () {
        const used = info.isTypeUsed(messageA, [fileDeclareMessageA]);
        expect(used).toBeFalse();
    });

    it('should return false for enum in declaring file', function () {
        const used = info.isTypeUsed(enumA, [fileDeclareEnumA]);
        expect(used).toBeFalse();
    });

});
