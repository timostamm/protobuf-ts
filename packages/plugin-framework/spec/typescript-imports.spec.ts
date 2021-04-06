import {createNamedImport, ensureNamedImportPresent, findNamedImports, TypescriptFile} from "../src";


describe('ensureNamedImportPresent()', function () {

    it('creates type import', function () {
        let file = new TypescriptFile("test.ts");
        ensureNamedImportPresent(
            file.getSourceFile(),
            "MyType",
            "my-type",
            true,
            [],
            s => file.addStatement(s),
            '$'
        );
        expect(file.getContent().trim())
            .toBe('import type { MyType } from "my-type";');
    });

    it('creates value import', function () {
        let file = new TypescriptFile("test.ts");
        ensureNamedImportPresent(
            file.getSourceFile(),
            "myVal",
            "my-val",
            false,
            [],
            s => file.addStatement(s),
            '$'
        );
        expect(file.getContent().trim())
            .toBe('import { myVal } from "my-val";');
    });

    it('resolves clash between type and value import', function () {
        let file = new TypescriptFile("test.ts");
        let first = ensureNamedImportPresent(
            file.getSourceFile(),
            "Foo",
            "my-type",
            true,
            [],
            s => file.addStatement(s),
            '$'
        );
        expect(first).toBe("Foo");
        let second = ensureNamedImportPresent(
            file.getSourceFile(),
            "Foo",
            "my-type",
            false,
            [],
            s => file.addStatement(s),
            '$'
        );
        expect(second).toBe("Foo$");
        expect(file.getContent())
            .toContain('import {');
        expect(file.getContent())
            .toContain('import type {');
    });

});


describe('createNamedImport()', function () {

    it('creates type import', function () {
        let file = new TypescriptFile("test.ts");
        file.addStatement(
            createNamedImport("MyType", "my-type", undefined, true)
        );
        expect(file.getContent().trim())
            .toBe('import type { MyType } from "my-type";');
    });

    it('creates value import', function () {
        let file = new TypescriptFile("test.ts");
        file.addStatement(
            createNamedImport("myVal", "my-val")
        );
        expect(file.getContent().trim())
            .toBe('import { myVal } from "my-val";');
    });

});


describe('findNamedImports()', function () {

    it('finds type import', function () {
        let file = new TypescriptFile("test.ts");
        file.addStatement(
            createNamedImport("MyType", "my-type", undefined, true)
        );
        const imports = findNamedImports(file.getSourceFile())
        expect(imports).toEqual([{name: 'MyType', as: undefined, from: 'my-type', isTypeOnly: true}]);
    });

    it('finds value import', function () {
        let file = new TypescriptFile("test.ts");
        file.addStatement(
            createNamedImport("myVal", "my-val")
        );
        const imports = findNamedImports(file.getSourceFile())
        expect(imports).toEqual([{name: 'myVal', as: undefined, from: 'my-val', isTypeOnly: false}]);
    });

});

