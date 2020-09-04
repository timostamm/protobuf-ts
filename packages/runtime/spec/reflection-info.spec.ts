import {normalizeFieldInfo, ScalarType} from "../src";
import {RepeatType} from "../src";


describe('normalizeFieldInfo()', () => {

    it('uses `localName` as-is if provided', () => {
        const d = normalizeFieldInfo({
            kind: 'scalar',
            no: 1,
            name: 'field_name',
            localName: 'CUSTOM_FIELD_NAME',
            T: ScalarType.BOOL
        });
        expect(d.localName).toBe('CUSTOM_FIELD_NAME');
    });

    it('makes `jsonName` from `name`', () => {
        const d = normalizeFieldInfo({
            kind: 'scalar',
            no: 1,
            name: 'field_name',
            T: ScalarType.BOOL
        });
        expect(d.jsonName).toBe('fieldName');
    });

    it('uses `jsonName` as-is if provided', () => {
        const d = normalizeFieldInfo({
            kind: 'scalar',
            no: 1,
            name: 'field_name',
            jsonName: 'JSON_FIELD_NAME',
            T: ScalarType.BOOL
        });
        expect(d.jsonName).toBe('JSON_FIELD_NAME');
    });

    it('should allow repeat = NO', () => {
        const d = normalizeFieldInfo({
            kind: 'scalar',
            no: 1,
            name: 'field_name',
            T: ScalarType.BOOL,
            repeat: RepeatType.NO
        });
        expect(d.repeat).toBe(RepeatType.NO);
    });
    it('should allow = PACKED', () => {
        const d = normalizeFieldInfo({
            kind: 'scalar',
            no: 1,
            name: 'field_name',
            T: ScalarType.BOOL,
            repeat: RepeatType.PACKED
        });
        expect(d.repeat).toBe(RepeatType.PACKED);
    });
    it('should allow = UNPACKED', () => {
        const d = normalizeFieldInfo({
            kind: 'scalar',
            no: 1,
            name: 'field_name',
            T: ScalarType.BOOL,
            repeat: RepeatType.UNPACKED
        });
        expect(d.repeat).toBe(RepeatType.UNPACKED);
    });
    it('should set repeat = NO', () => {
        const d = normalizeFieldInfo({
            kind: 'scalar',
            no: 1,
            name: 'field_name',
            T: ScalarType.BOOL,
        });
        expect(d.repeat).toBe(RepeatType.NO);
    });

});

