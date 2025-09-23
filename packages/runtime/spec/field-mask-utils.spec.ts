import {fieldMaskUtils} from "../src/field-mask-utils";

const {
    canonicalForm,
    from,
    intersect,
    union,
} = fieldMaskUtils;

/**
 * Other FieldMaskUtils test can be found in the test-generated package.
 * These tests operater purely on plain strings and don't require any MessageTypes.
 */
describe('FieldMaskUtils', function () {
    // https://github.com/protocolbuffers/protobuf/blob/c9d2bd2fc781/python/google/protobuf/internal/well_known_types_test.py#L463
    describe('canonicalForm()', function () {
        it('sorts the paths', () => {
            const mask = from('baz.quz,bar,foo');
            const outMask = from('');
            canonicalForm(mask, outMask);
            expect(outMask.paths).toEqual(['bar', 'baz.quz', 'foo']);
        });

        it('deduplicates the paths', () => {
            const mask = from('foo,bar,foo');
            const outMask = canonicalForm(mask);
            expect(outMask).toEqual(from('bar,foo'));
        });

        it('removes sub-paths or other paths', () => {
            const mask = from('foo.b1,bar.b1,foo.b2,bar');
            const outMask = canonicalForm(mask);
            expect(outMask).toEqual(from('bar,foo.b1,foo.b2'));
        });

        it('handles more deeply nested cases', () => {
            let mask = from([
                'foo.bar.baz1',
                'foo.bar.baz2.quz',
                'foo.bar.baz2',
            ]);
            let outMask = canonicalForm(mask);
            expect(outMask).toEqual(from('foo.bar.baz1,foo.bar.baz2'));

            mask = from([
                'foo.bar.baz1',
                'foo.bar.baz2',
                'foo.bar.baz2.quz',
            ]);
            outMask = canonicalForm(mask);
            expect(outMask).toEqual(from('foo.bar.baz1,foo.bar.baz2'));

            mask = from([
                'foo.bar.baz1',
                'foo.bar.baz2',
                'foo.bar.baz2.quz',
                'foo.bar',
            ]);
            outMask = canonicalForm(mask);
            expect(outMask).toEqual(from('foo.bar'));

            mask = from([
                'foo.bar.baz1',
                'foo.bar.baz2',
                'foo.bar.baz2.quz',
                'foo',
            ]);
            outMask = canonicalForm(mask);
            expect(outMask).toEqual(from('foo'));
        });
    });

    // https://github.com/protocolbuffers/protobuf/blob/c9d2bd2fc781/python/google/protobuf/internal/well_known_types_test.py#L499
    describe('union()', function () {
        it('handles no overlap', () => {
            const expected = from('bar,baz,foo,quz');
            const outMask = from('');
            const mask1 = from('foo,baz');
            const mask2 = from('bar,quz');
            expect(union(mask1, mask2)).toEqual(expected);
            expect(outMask).not.toEqual(expected);
            expect(union(mask1, mask2, outMask)).toEqual(expected);
            expect(outMask).toEqual(expected);
        });
        it('handles overlap with duplicate paths', () => {
            const mask1 = from('foo,baz.bb');
            const mask2 = from('baz.bb,quz');
            expect(union(mask1, mask2)).toEqual(from('baz.bb,foo,quz'));
        });
        it('handles overlap with paths covering some other paths', () => {
            const mask1 = from('foo.bar.baz,quz');
            const mask2 = from('foo.bar,bar');
            expect(union(mask1, mask2)).toEqual(from('bar,foo.bar,quz'));
        });
    });

    // https://github.com/protocolbuffers/protobuf/blob/c9d2bd2fc781/python/google/protobuf/internal/well_known_types_test.py#L521
    describe('intersect()', function () {
        it('handles no overlap', () => {
            const mask1 = from('foo,baz');
            const mask2 = from('bar,quz');
            expect(intersect(mask1, mask2)).toEqual(from(''));
        });
        it('handles overlap with duplicate paths', () => {
            const mask1 = from('foo,baz.bb');
            const mask2 = from('baz.bb,quz');
            expect(intersect(mask1, mask2)).toEqual(from('baz.bb'));
        });
        it('handles overlap with paths covering some other paths', () => {
            const expected = from('foo.bar.baz');
            const mask1 = from('foo.bar.baz,quz');
            const mask2 = from('foo.bar,bar');
            expect(intersect(mask1, mask2)).toEqual(expected);
            expect(intersect(mask2, mask1)).toEqual(expected);
        });
        it('handles intersect "" with ""', () => {
            const mask1 = from('');
            const mask2 = from('');
            mask1.paths.push('');
            mask2.paths.push('');
            expect(mask1.paths).toEqual(['']);
            expect(intersect(mask1, mask2)).toEqual(from(''));
        });
        it('handles overlap with unsorted fields', () => {
            const mask1 = from('baz.bb,foo');
            const mask2 = from('quz,baz.bb');
            expect(intersect(mask1, mask2)).toEqual(from('baz.bb'));
        });
    });
});
