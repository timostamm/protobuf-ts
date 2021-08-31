import {MessageType, ScalarType, containsMessageType, getMessageType} from '../src';

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
            expect(getMessageType(msg)).toEqual(MyMessage);
        } else {
            fail("containsMessageType() must return true");
        }
    });

    it('allows to extract type after .clone', () => {
        const msg = MyMessage.create({
            stringField: "hello world",
        });

        const cloned = MyMessage.clone(msg);
        if (containsMessageType(cloned)) {
            expect(getMessageType(cloned)).toEqual(MyMessage);
        } else {
            fail("containsMessageType() must return true");
        }
    });

    it('returns error if provided a non-message', () => {
        const msg: MyMessage = { stringField: "foo" };

        expect(containsMessageType(msg)).toBeFalse();
    });
});
