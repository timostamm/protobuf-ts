import {Duration} from "../gen/google/protobuf/duration";
import {Timestamp} from "../gen/google/protobuf/timestamp";

// Copied from test-default/message-type.spec.ts. Do not edit.

describe('MessageType', function () {
    it('equals()', () => {
        const dur = Duration.create();
        const tim = Timestamp.create();
        expect( Duration.equals(dur, tim)).toBe(false);
    });
});
