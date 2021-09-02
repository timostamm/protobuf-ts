import {MessageType, ScalarType, containsMessageType, MESSAGE_TYPE} from '../src';

describe('containsMessageType', () => {
    interface MyMessage {
        stringField: string;
    }

    const MyMessage: MessageType<MyMessage> = new MessageType<MyMessage>('.test.MyMessage', [
        {no: 1, name: 'string_field', kind: "scalar", T: ScalarType.STRING},
    ]);

    it('allows to extract type after .create', () => {
        const msg = MyMessage.create({
            stringField: "hello world",
        });

        if (containsMessageType(msg)) {
            expect(msg[MESSAGE_TYPE]).toEqual(MyMessage);
        } else {
            fail("containsMessageType() must return true");
        }
    });

    it('allows to extract type after .clone', () => {
        const cloned = MyMessage.clone(MyMessage.create({
            stringField: "hello world",
        }));

        if (containsMessageType(cloned)) {
            expect(cloned[MESSAGE_TYPE]).toEqual(MyMessage);
        } else {
            fail("containsMessageType() must return true");
        }
    });

    it('returns false if provided a non-message', () => {
        const msg: MyMessage = { stringField: "foo" };

        expect(containsMessageType(msg)).toBeFalse();
    });
});
