import {
    IMessageType,
    MessageInfo,
    MessageType,
    normalizeFieldInfo,
    reflectionCreate,
    reflectionMergePartial,
    RepeatType,
    ScalarType,
    UnknownMessage
} from "../src";
import {stubMessageType} from "./support/helpers";


describe('reflectionMergePartial()', () => {

    describe('with scalar fields', () => {

        const string_field = normalizeFieldInfo({
            kind: "scalar", T: ScalarType.STRING,
            no: 1, name: 'string_field'
        });
        const bool_field = normalizeFieldInfo({
            kind: "scalar", T: ScalarType.BOOL,
            no: 1, name: 'bool_field'
        });
        const repeated_string_field = normalizeFieldInfo({
            kind: "scalar", T: ScalarType.STRING, repeat: RepeatType.PACKED,
            no: 1, name: 'repeated_string_field'
        });

        const messageInfo = new MessageType<UnknownMessage>('.test.TestMessage', [string_field, bool_field, repeated_string_field]);

        it('new value overwrites old value', () => {
            const target = reflectionCreate(messageInfo);
            target[string_field.localName] = "hello";
            const source = {
                [string_field.localName]: "world"
            }
            reflectionMergePartial(messageInfo, target, source);
            expect(target[string_field.localName]).toBe("world");
        });

        it('new default value overwrites old value', () => {
            const target = reflectionCreate(messageInfo);
            target[string_field.localName] = "hello";
            const source = {
                [string_field.localName]: ""
            };
            reflectionMergePartial(messageInfo, target, source);
            expect(target[string_field.localName]).toBe("");
        });

        it('null value does not overwrite existing value', () => {
            const target = reflectionCreate(messageInfo);
            target[string_field.localName] = "hello";
            const source = {
                [string_field.localName]: null as unknown as string
            };
            reflectionMergePartial(messageInfo, target, source);
            expect(target[string_field.localName]).toBe("hello");
        });

        it('omitted value does not overwrite existing value', () => {
            const target = reflectionCreate(messageInfo);
            target[string_field.localName] = "hello";
            const source = {};
            reflectionMergePartial(messageInfo, target, source);
            expect(target[string_field.localName]).toBe("hello");
        });

        it('repeated fields are overwritten', () => {
            const target = reflectionCreate(messageInfo);
            const arr = repeated_string_field.localName;
            const targetArr = target[arr] = ['a', 'b'];
            const source = { [arr]: ['c'] };
            reflectionMergePartial(messageInfo, target, source);
            expect(target[arr]).toEqual(source[arr]);
            expect(target[arr]).not.toBe(source[arr]);
            expect(target[arr]).toBe(targetArr);
        });

    });

    describe('with message field', () => {

        let messageInfo: MessageInfo;
        let childHandler: IMessageType<any>;
        let handlerCreateReturn = {fake_handler_create_return_value: true} as const;

        beforeEach(() => {
            childHandler = stubMessageType('Child');
            spyOn(childHandler, 'mergePartial');
            spyOn(childHandler, 'create').and.returnValue(handlerCreateReturn);
            messageInfo = {
                typeName: 'Host',
                fields: [
                    normalizeFieldInfo({kind: "message", T: () => childHandler, no: 1, name: 'child'}),
                    normalizeFieldInfo({kind: "message", T: () => childHandler, no: 2, name: 'children', repeat: RepeatType.UNPACKED}),
                ],
                options: {}
            };
        });

        describe('and source field empty', () => {
            const source: object = {child: undefined};
            it('does not touch target', () => {
                const target: any = {child: 123};
                reflectionMergePartial(messageInfo, target, source);
                expect(target.child).toBe(123);
            });
            it('does not call child handler', () => {
                reflectionMergePartial(messageInfo, {}, source);
                expect(childHandler.create).not.toHaveBeenCalled();
                expect(childHandler.mergePartial).not.toHaveBeenCalled();
            });
        });

        describe('and source field null', () => {
            const source: object = {child: null};
            it('does not touch target', () => {
                const target: any = {child: 123};
                reflectionMergePartial(messageInfo, target, source);
                expect(target.child).toBe(123);
            });
            it('does not call child handler', () => {
                reflectionMergePartial(messageInfo, {}, source);
                expect(childHandler.create).not.toHaveBeenCalled();
                expect(childHandler.mergePartial).not.toHaveBeenCalled();
            });
        });

        describe('and target field empty', () => {
            it('calls child handler´s create()', () => {
                const source = {child: {other_msg_fake_field: true}};
                const target = {child: undefined};
                reflectionMergePartial<any>(messageInfo, target, source);
                expect(childHandler.create).toHaveBeenCalled();
                expect(childHandler.create).toHaveBeenCalledWith(source.child);
            });
            it('uses child handler´s create()', () => {
                const target: any = {};
                const source = {child: {}};
                reflectionMergePartial(messageInfo, target, source);
                expect(target.child).toEqual(handlerCreateReturn);
            });
        });

        describe('and target field non-empty', () => {
            it('calls child handler´s mergePartial()', () => {
                const source = {child: {other_msg_fake_field: true}};
                const target = {child: {other_msg_fake_field: false}};
                reflectionMergePartial(messageInfo, target, source);
                expect(childHandler.mergePartial).toHaveBeenCalled();
                expect(childHandler.mergePartial).toHaveBeenCalledWith({other_msg_fake_field: false}, {other_msg_fake_field: true});
            });
        });

        describe('which is repeated', () => {
            it('is overwritten', () => {
                const source = {children: [{fake_handler_create_return_value: true}]};
                const target = {children: [{fake_handler_create_return_value: false}, {fake_handler_create_return_value: false}]};
                const targetArr = target.children;
                reflectionMergePartial(messageInfo, target, source);
                expect(target.children).toEqual(source.children);
                expect(target.children).not.toBe(source.children);
                expect(target.children).toBe(targetArr);
            });
        });

    });

});

