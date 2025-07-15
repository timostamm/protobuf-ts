import {Duration} from "../gen/google/protobuf/duration";
import {Timestamp} from "../gen/google/protobuf/timestamp";


describe('MessageType', function () {
    it('equals()', () => {
        const dur = Duration.create();
        const tim = Timestamp.create();
        expect( Duration.equals(dur, tim)).toBe(false);
    });
});
