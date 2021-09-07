import {containsMessageType, MESSAGE_TYPE, MessageType, RepeatType, ScalarType} from "../src";


describe('MessageType', () => {

    interface MyMessage {
        stringField: string;
        boolField: boolean;
        repeatedInt32Field: number[],
        msg?: MyMessage;
        result: { oneofKind: 'error'; readonly error: string; }
            | { oneofKind: 'value'; readonly value: number; }
            | { oneofKind: undefined; };
        messageMap: { [key: string]: MyMessage };
    }

    const MyMessage: MessageType<MyMessage> = new MessageType<MyMessage>('.test.MyMessage', [
        {no: 1, name: 'string_field', kind: "scalar", T: ScalarType.STRING},
        {no: 2, name: 'bool_field', kind: "scalar", T: ScalarType.BOOL},
        {no: 3, name: 'repeated_int32_field', kind: "scalar", T: ScalarType.INT32, repeat: RepeatType.PACKED},
        {no: 4, name: 'msg', kind: "message", T: () => MyMessage},
        {no: 5, name: 'error', kind: "scalar", T: ScalarType.STRING, oneof: 'result'},
        {no: 6, name: 'value', kind: "scalar", T: ScalarType.INT32, oneof: 'result'},
        {
            no: 7, name: 'message_map', kind: "map", K: ScalarType.STRING, V: {kind: "message", T: () => MyMessage}
        }
    ]);

    it('create() creates instance from partial data', () => {
        const msg = MyMessage.create({
            stringField: "hello world",
            result: {
                oneofKind: 'value',
                value: 123
            },
            messageMap: {
                "abc": {}
            }
        });
        expect(msg).not.toBeNull();
        expect(msg.boolField).toBeFalse();
        expect(msg).toEqual({
            stringField: "hello world",
            boolField: false,
            repeatedInt32Field: [],
            // msg: undefined,
            result: {
                oneofKind: 'value',
                value: 123
            },
            messageMap: {
                "abc": {
                    stringField: "",
                    boolField: false,
                    // msg: undefined,
                    result: {oneofKind: undefined},
                    messageMap: {},
                    repeatedInt32Field: [],
                }
            }
        });
    })

    it('clone() copies repeated scalar array', () => {
        const msg = MyMessage.create({
            repeatedInt32Field: [1, 2, 3]
        });
        const copy = MyMessage.clone(msg);
        expect(copy).toEqual(msg);
        expect(MyMessage.is(copy));
        expect(copy.repeatedInt32Field).not.toBe(msg.repeatedInt32Field);
    })

    it('create() adds message type', () => {
        const msg = MyMessage.create({
            stringField: "hello world",
        });
        expect(containsMessageType(msg)).toBeTrue();
        if (containsMessageType(msg)) {
            expect(msg[MESSAGE_TYPE]).toBe(MyMessage);
        } else {
            fail("containsMessageType() must return true");
        }
    })

    it('create() creates expected object', () => {
        const msg = MyMessage.create({
            stringField: "hello world",
        });
        const exp: MyMessage = {
            boolField: false,
            messageMap: {},
            stringField: "hello world",
            repeatedInt32Field: [],
            result: {
                oneofKind: undefined
            },
        }
        expect(msg).toEqual(exp);
    })

});

