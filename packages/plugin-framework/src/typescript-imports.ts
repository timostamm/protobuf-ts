import {assert} from "@protobuf-ts/runtime";
import * as ts from "typescript";
import * as path from "path";
import {SymbolTable} from "./symbol-table";
import {AnyTypeDescriptorProto} from "./descriptor-info";
import {TypescriptFile} from "./typescript-file";


export class TypeScriptImports {

    private readonly symbols: SymbolTable;
    private readonly enable_import_extensions: boolean;

    constructor(symbols: SymbolTable, enable_import_extensions: boolean) {
        this.symbols = symbols;
        this.enable_import_extensions = enable_import_extensions;
    }


    /**
     * Import {importName} from "importFrom";
     *
     * Automatically finds a free name if the
     * `importName` would collide with another
     * identifier.
     *
     * Returns imported name.
     */
    name(source: TypescriptFile, importName: string, importFrom: string, isTypeOnly = false): string {
        const blackListedNames = this.symbols.list(source).map(e => e.name);
        return ensureNamedImportPresent(
            source.getSourceFile(),
            importName,
            importFrom,
            isTypeOnly,
            blackListedNames,
            statementToAdd => source.addStatement(statementToAdd, true)
        );
    }


    /**
     * Import * as importAs from "importFrom";
     *
     * Returns name for `importAs`.
     */
    namespace(source: TypescriptFile, importAs: string, importFrom: string, isTypeOnly = false): string {
        return ensureNamespaceImportPresent(
            source.getSourceFile(),
            importAs,
            importFrom,
            isTypeOnly,
            statementToAdd => source.addStatement(statementToAdd, true)
        );
    }


    /**
     * Import a previously registered identifier for a message
     * or other descriptor.
     *
     * Uses the symbol table to look for the type, adds an
     * import statement if necessary and automatically finds a
     * free name if the identifier would clash in this file.
     *
     * If you have multiple representations for a descriptor
     * in your generated code, use `kind` to discriminate.
     */
    type(source: TypescriptFile, descriptor: AnyTypeDescriptorProto, kind = 'default', isTypeOnly = false): string {
        const symbolReg = this.symbols.get(descriptor, kind);

        // symbol in this file?
        if (symbolReg.file === source) {
            return symbolReg.name;
        }

        // symbol not in file
        // add an import statement
        const importPath = createRelativeImportPath(
            source.getSourceFile().fileName,
            symbolReg.file.getFilename(),
            this.enable_import_extensions
        );
        const blackListedNames = this.symbols.list(source).map(e => e.name);
        return ensureNamedImportPresent(
            source.getSourceFile(),
            symbolReg.name,
            importPath,
            isTypeOnly,
            blackListedNames,
            statementToAdd => source.addStatement(statementToAdd, true)
        );
    }


}


/**
 * Import * as asName from "importFrom";
 *
 * If the import is already present, just return the
 * identifier.
 *
 * If the import is not present, create the import
 * statement and call `addStatementFn`.
 *
 * Does *not* check for collisions.
 */
function ensureNamespaceImportPresent(
    currentFile: ts.SourceFile,
    asName: string,
    importFrom: string,
    isTypeOnly: boolean,
    addStatementFn: (statementToAdd: ts.ImportDeclaration) => void,
): string {
    const
        all = findNamespaceImports(currentFile),
        match = all.find(ni => ni.as === asName && ni.from === importFrom && ni.isTypeOnly === isTypeOnly);
    if (match) {
        return match.as;
    }
    const statementToAdd = createNamespaceImport(asName, importFrom, isTypeOnly);
    addStatementFn(statementToAdd);
    return asName;
}

/**
 * import * as <asName> from "<importFrom>";
 */
function createNamespaceImport(asName: string, importFrom: string, isTypeOnly: boolean) {
    return ts.createImportDeclaration(
        undefined,
        undefined,
        ts.createImportClause(
            undefined,
            ts.createNamespaceImport(ts.createIdentifier(asName)),
            isTypeOnly
        ),
        ts.createStringLiteral(importFrom)
    );
}

/**
 * import * as <as> from "<from>";
 */
function findNamespaceImports(sourceFile: ts.SourceFile): { as: string; from: string; isTypeOnly: boolean }[] {
    let r: Array<{ as: string; from: string; isTypeOnly: boolean }> = [];
    for (let s of sourceFile.statements) {
        if (ts.isImportDeclaration(s) && s.importClause) {
            let namedBindings = s.importClause.namedBindings;
            if (namedBindings && ts.isNamespaceImport(namedBindings)) {
                assert(ts.isStringLiteral(s.moduleSpecifier));
                r.push({
                    as: namedBindings.name.escapedText.toString(),
                    from: s.moduleSpecifier.text,
                    isTypeOnly: s.importClause.isTypeOnly,
                });
            }
        }
    }
    return r;
}

/**
 * import {importName} from "importFrom";
 * import type {importName} from "importFrom";
 *
 * If the import is already present, just return the
 * identifier.
 *
 * If the import is not present, create the import
 * statement and call `addStatementFn`.
 *
 * If the import name is taken by another named import
 * or is in the list of blacklisted names, an
 * alternative name is used:
 *
 * Import {importName as alternativeName} from "importFrom";
 *
 * Returns the imported name or the alternative name.
 */
export function ensureNamedImportPresent(
    currentFile: ts.SourceFile,
    importName: string,
    importFrom: string,
    isTypeOnly: boolean,
    blacklistedNames: string[],
    addStatementFn: (statementToAdd: ts.ImportDeclaration) => void,
    escapeCharacter = '$'
): string {
    const
        all = findNamedImports(currentFile),
        taken = all.map(ni => ni.as ?? ni.name).concat(blacklistedNames),
        match = all.find(ni => ni.name === importName && ni.from === importFrom && ni.isTypeOnly === isTypeOnly);
    if (match) {
        return match.as ?? match.name;
    }
    let as: string | undefined;
    if (taken.includes(importName)) {
        let i = 0;
        as = importName;
        while (taken.includes(as)) {
            as = importName + escapeCharacter;
            if (i++ > 0) {
                as += i;
            }
        }
    }
    const statementToAdd = createNamedImport(importName, importFrom, as, isTypeOnly);
    addStatementFn(statementToAdd);
    return as ?? importName;
}

/**
 * import {<name>} from '<from>';
 * import {<name> as <as>} from '<from>';
 * import type {<name>} from '<from>';
 * import type {<name> as <as>} from '<from>';
 */
export function createNamedImport(name: string, from: string, as?: string, isTypeOnly = false): ts.ImportDeclaration {
    if (as) {
        return ts.createImportDeclaration(
            undefined,
            undefined,
            ts.createImportClause(
                undefined,
                ts.createNamedImports([ts.createImportSpecifier(
                    ts.createIdentifier(name),
                    ts.createIdentifier(as)
                )]),
                isTypeOnly
            ),
            ts.createStringLiteral(from)
        );
    }
    return ts.createImportDeclaration(
        undefined,
        undefined,
        ts.createImportClause(
            undefined,
            ts.createNamedImports([
                ts.createImportSpecifier(
                    undefined,
                    ts.createIdentifier(name)
                )
            ]),
            isTypeOnly
        ),
        ts.createStringLiteral(from)
    );
}

/**
 * import {<name>} from '<from>';
 * import {<name> as <as>} from '<from>';
 * import type {<name>} from '<from>';
 * import type {<name> as <as>} from '<from>';
 */
export function findNamedImports(sourceFile: ts.SourceFile): { name: string, as: string | undefined, from: string, isTypeOnly: boolean }[] {
    let r: Array<{ name: string, as: string | undefined, from: string, isTypeOnly: boolean }> = [];
    for (let s of sourceFile.statements) {
        if (ts.isImportDeclaration(s) && s.importClause) {
            let namedBindings = s.importClause.namedBindings;
            if (namedBindings && ts.isNamedImports(namedBindings)) {
                for (let importSpecifier of namedBindings.elements) {
                    assert(ts.isStringLiteral(s.moduleSpecifier));
                    if (importSpecifier.propertyName) {
                        r.push({
                            name: importSpecifier.propertyName.escapedText.toString(),
                            as: importSpecifier.name.escapedText.toString(),
                            from: s.moduleSpecifier.text,
                            isTypeOnly: s.importClause.isTypeOnly
                        })
                    } else {
                        r.push({
                            name: importSpecifier.name.escapedText.toString(),
                            as: undefined,
                            from: s.moduleSpecifier.text,
                            isTypeOnly: s.importClause.isTypeOnly
                        })
                    }
                }
            }
        }
    }
    return r;
}

/**
 * Create a relative path for an import statement like
 * `import {Foo} from "./foo"`
 */
function createRelativeImportPath(currentPath: string, pathToImportFrom: string, addExtension: boolean): string {
    // create relative path to the file to import
    let fromPath = path.relative(path.dirname(currentPath), pathToImportFrom);

    // on windows, this may add backslash directory separators.
    // we replace them with forward slash.
    if (path.sep !== "/") {
        fromPath = fromPath.split(path.sep).join("/");
    }

    // drop file extension
    fromPath = fromPath.replace(/\.[a-z]+$/, '');

    // make sure to start with './' to signal relative path to module resolution
    if (!fromPath.startsWith('../') && !fromPath.startsWith('./')) {
        fromPath = './' + fromPath;
    }
    
    // add .js extensions on import statements for ESM compatibility with typescript and nodejs
    if (addExtension === true) {
        fromPath = fromPath + ".js";
    }
    return fromPath;
}
