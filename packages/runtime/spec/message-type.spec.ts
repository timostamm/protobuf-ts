import {ScalarType} from "../src";
import {MessageType} from "../src";


describe('MessageType', () => {

    interface MyMessage {
        stringField: string;
        boolField: boolean;
        msg?: MyMessage;
        result: { oneofKind: 'error'; readonly error: string; }
            | { oneofKind: 'value'; readonly value: number; }
            | { oneofKind: undefined; };
        messageMap: { [key: string]: MyMessage };
    }

    const MyMessage: MessageType<MyMessage> = new MessageType<MyMessage>('.test.MyMessage', [
        {no: 1, name: 'string_field', kind: "scalar", T: ScalarType.STRING},
        {no: 2, name: 'bool_field', kind: "scalar", T: ScalarType.BOOL},
        {no: 3, name: 'msg', kind: "message", T: () => MyMessage},
        {no: 4, name: 'error', kind: "scalar", T: ScalarType.STRING, oneof: 'result'},
        {no: 5, name: 'value', kind: "scalar", T: ScalarType.INT32, oneof: 'result'},
        {
            no: 6, name: 'message_map', kind: "map", K: ScalarType.STRING, V: {kind: "message", T: () => MyMessage}
        }
    ]);

    it('creates instance from partial data', () => {
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
                    messageMap: {}
                }
            }
        });
    })

});

