import type {Fixture} from "./index";
import {MessageType} from "@protobuf-ts/runtime";


const f: Fixture[] = [];
export default f;

f.push({
    typeName: 'spec.MessageFieldMessage',
    fields: [
        {no: 1, name: "message_field", kind: "message", T: () => MessageFieldMessage_TestMessage},
        {
            no: 2,
            name: "repeated_message_field",
            repeat: 1,
            kind: "message",
            T: () => MessageFieldMessage_TestMessage
        }
    ],
    messages: {
        'default': {
            repeatedMessageField: [],
        },
        'example': {
            messageField: {name: "test"},
            repeatedMessageField: [{name: "a"}, {name: "b"}],
        },
    },
    json: {
        'default': {},
    },
    jsonReadErrors: {
        "repeated_message_field": {
            "null fails to parse": {
                input: [null],
                expect: /Cannot parse JSON null for /
            }
        },
    },


});


const MessageFieldMessage_TestMessage = new MessageType<any>("spec.MessageFieldMessage.TestMessage", [
    {no: 1, name: "name", kind: "scalar", T: 9 /*string*/}
]);
