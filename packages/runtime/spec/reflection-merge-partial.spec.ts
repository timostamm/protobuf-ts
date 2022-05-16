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
            target[repeated_string_field.localName] = ['a', 'b'];
            const source = {
                [repeated_string_field.localName]: ['c']
            };
            reflectionMergePartial(messageInfo, target, source);
            expect(target[repeated_string_field.localName]).toEqual(['c']);
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
                fields: [normalizeFieldInfo({kind: "message", T: () => childHandler, no: 1, name: 'child'})],
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


    });

    describe('with repeated scalar field', function () {

        let type = new MessageType<UnknownMessage>(".test.Message", [
            {no: 1, name: "arr", kind: "scalar", T: ScalarType.INT32, repeat: RepeatType.PACKED}
        ]);

        it('keeps target array instance', () => {
            let target: UnknownMessage = {
                arr: [1,2,3]
            };
            let targetArr = target.arr;
            let source = {
                arr: []
            };
            reflectionMergePartial(type, source, target);
            expect(target.arr).not.toBe(source.arr);
            expect(target.arr).toBe(targetArr);
        });

    });

});

