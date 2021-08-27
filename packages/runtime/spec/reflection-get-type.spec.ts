import {MessageType, ScalarType, reflectionGetType, reflectionIsProtoMessage} from '../src';

describe('reflectionGetType', () => {
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

        expect(reflectionIsProtoMessage(msg)).toBeTrue();
        expect(reflectionGetType(msg)).toEqual(MyMessage);
    });

    it('allows to extract type after .clone', () => {
        const msg = MyMessage.create({
            stringField: "hello world",
        });

        const cloned = MyMessage.clone(msg);

        expect(reflectionIsProtoMessage(cloned)).toBeTrue();
        expect(reflectionGetType(cloned)).toEqual(MyMessage);
    });

    it('returns error if provided a non-message', () => {
        const msg: MyMessage = { stringField: "foo" };

        expect(reflectionIsProtoMessage(msg)).toBeFalse();
        expect(() => reflectionGetType(msg)).toThrowError(/msg is not a protobuf message/);
    });
});
