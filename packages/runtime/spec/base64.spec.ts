import {base64decode, base64encode} from "../src";


describe('base64decode()', function () {

    const helloWorldBase64 = 'aGVsbG8g8J+MjQ==';
    const helloWorldBytes = [104, 101, 108, 108, 111, 32, 240, 159, 140, 141];

    it('decodes base64 "hello 🌍"', function () {
        let byt = base64decode(helloWorldBase64);
        expect(byt).toEqual(new Uint8Array(helloWorldBytes));
    });

    it('works with concatenated base64', function () {
        let byt = base64decode(helloWorldBase64 + helloWorldBase64);
        expect(byt).toEqual(new Uint8Array([...helloWorldBytes, ...helloWorldBytes]));
    });

    it('does not require padding', function(){
        let byt = base64decode("aGVsbG8g8J+MjQ");
        expect(byt).toEqual(new Uint8Array(helloWorldBytes));
    });

    it('understands base64url "-" and "-"', function(){
        let byt = base64decode("-_");
        expect(byt).toEqual(new Uint8Array([251]));
    });
});


describe('base64encode()', function () {

    const helloWorldBase64 = 'aGVsbG8g8J+MjQ==';
    const helloWorldBytes = new Uint8Array([104, 101, 108, 108, 111, 32, 240, 159, 140, 141]);

    it('encodes "hello 🌍" correctly', function () {
        let b64 = base64encode(helloWorldBytes);
        expect(b64).toEqual(helloWorldBase64);
    });

});

