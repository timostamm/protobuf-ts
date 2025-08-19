import {DescFile} from "@bufbuild/protobuf";
import {
    createFilePrinter,
    FilePrinter,
    ImportProcessor,
} from "@bufbuild/protoplugin-print";
import {Interpreter} from "./interpreter";
import {createPreamble} from "./preamble";
import {Options} from "./options";
import {createPrintableTypes, Printable} from "./printable";

export type File = FilePrinter<Printable> & {
    preamble?: string
    // TODO ?
    //export: createExportStatement,
    desc: DescFile;
};

export type Schema = {
    createFile(desc: DescFile, suffix: string): File;
    interpreter: Interpreter;
    options: Options;
    getFiles(): File[];
    getFileContents(): FileContents[];
};

type FileContents = {
    getContent(): string;
    getFilename(): string;
};

export function createSchema(
    interpreter: Interpreter,
    options: Options,
): Schema {
    const files: File[] = [];
    const printableTypes = createPrintableTypes();
    const importProcessor = new ImportProcessor(
        (path) => {
            if (path.endsWith(".js")) {
                return path.substring(0, path.length - 3);
            }
            return path;
        }
    );
    return {
        interpreter,
        options,
        getFiles() {
            return files;
        },
        createFile(desc: DescFile, suffix: string): File {
            const preamble = createPreamble(desc, {
                pluginCredit: options.pluginCredit,
                esLintDisable: options.esLintDisable,
                tsNoCheck: options.tsNoCheck,
            });
            const file: File = {
                desc,
                ...createFilePrinter(
                    printableTypes,
                    desc.name + suffix,
                    importProcessor,
                ),
                preamble,
            };
            files.push(file);
            return file;
        },
        getFileContents() {
            return files.map(file => ({
                getContent(): string {
                    const body = file.toString();
                    if (body.length && file.preamble?.length) {
                        return file.preamble + body;
                    }
                    return body;
                }, getFilename(): string {
                    return file.name;
                }
            }));
        }
    };
}
