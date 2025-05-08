import * as ts from "typescript";


export class TypescriptFile {

    private sf: ts.SourceFile;


    constructor(filename: string) {
        this.sf = ts.createSourceFile(filename, "", ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);
    }


    getFilename(): string {
        return this.sf.fileName;
    }


    /**
     * Add the new statement to the file.
     */
    addStatement(statement: ts.Statement, atTop = false): void {
        const newStatements = atTop
            ? [statement, ...this.sf.statements]
            : this.sf.statements.concat(statement)
        this.sf = ts.updateSourceFileNode(
            this.sf, newStatements,
        );
    }


    /**
     * The underlying SourceFile
     */
    getSourceFile(): ts.SourceFile {
        return this.sf;
    }


    /**
     * Are there any statements in this file?
     */
    isEmpty(): boolean {
        return this.sf.statements.length === 0;
    }


    /**
     * The full content of this file.
     * Returns an empty string if there are no statements.
     */
    getContent(): string {
        let printer: ts.Printer = ts.createPrinter({newLine: ts.NewLineKind.LineFeed});
        return printer.printFile(this.sf);
    }

}
