import {Duration} from "../gen/google/protobuf/duration";
import {Timestamp} from "../gen/google/protobuf/timestamp";

// Copied from test-default/message-type.spec.ts. Do not edit.

describe('MessageType', function () {
    it('equals()', () => {
        const dur = Duration.create();
        const tim = Timestamp.create();
        expect( Duration.equals(dur, tim)).toBe(false);
    });
    it('is()', () => {
        const dur = Duration.create();
        const tim = Timestamp.create();
        expect( Duration.is(dur)).toBe(true);
        expect( Timestamp.is(tim)).toBe(true);
        expect( Duration.is(tim)).toBe(false);
        expect( Timestamp.is(dur)).toBe(false);
    });
    it('isAssignable()', () => {
        const dur = Duration.create();
        const tim = Timestamp.create();
        expect( Duration.isAssignable(dur)).toBe(true);
        expect( Timestamp.isAssignable(tim)).toBe(true);
        expect( Duration.isAssignable(tim)).toBe(true);
        expect( Timestamp.isAssignable(dur)).toBe(true);
    });
});
