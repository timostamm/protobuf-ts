import {DescFile} from "@bufbuild/protobuf";
import {Options} from "./options";
import {OutFile} from "./out-file";


export class FileTable {


    readonly outFiles: OutFile[] = [];
    private readonly entries: FileTableEntry[] = [];
    private readonly clashResolveMaxTries = 100;
    private readonly clashResolver: ClashResolver;


    constructor(
        private readonly options: Options,
        clashResolver?: ClashResolver,
    ) {
        this.clashResolver = clashResolver ?? FileTable.defaultClashResolver;
    }


    register(requestedName: string, descFile: DescFile, kind = 'default'): string {

        // Only one symbol per kind can be registered for a descriptor.
        if (this.has(descFile, kind)) {
            let {name} = this.get(descFile, kind);
            let msg = `Cannot register name "${requestedName}" of kind "${kind}" for ${descFile.toString()}. `
                + `The descriptor is already registered with name "${name}". `
                + `Use a different 'kind' to register multiple symbols for a descriptor.`
            throw new Error(msg);
        }

        // find a free name within the file
        let name = requestedName;
        let count = 0;
        while (this.hasName(name) && count < this.clashResolveMaxTries) {
            name = this.clashResolver(descFile, requestedName, kind, ++count, name);
        }
        if (this.hasName(name)) {
            let msg = `Failed to register name "${requestedName}" for ${descFile.toString()}. `
                + `Gave up finding alternative name after ${this.clashResolveMaxTries} tries. `
                + `There is something wrong with the clash resolver.`;
            throw new Error(msg);
        }

        // add the entry and return name
        this.entries.push({desc: descFile, kind, name});
        return name;
    }


    create(descFile: DescFile, kind = 'default') {
        const outFile = new OutFile(
            this.get(descFile, kind).name,
            descFile,
            this.options,
        );
        this.outFiles.push(outFile);
        return outFile;
    }


    protected hasName = (name: string) =>
        this.entries.some(e => e.name === name);


    /**
     * Find a symbol (of the given kind) for the given descriptor.
     * Return `undefined` if not found.
     */
    private findByProtoFilenameAndKind(protoFilename: string | undefined, kind = 'default'): FileTableEntry | undefined {
        return this.entries.find(e => e.desc.proto.name === protoFilename && e.kind === kind);
    }


    /**
     * Find a symbol (of the given kind) for the given descriptor.
     * Raises error if not found.
     */
    get(descriptor: DescFile, kind = 'default'): FileTableEntry {
        const protoFilename = descriptor.proto.name;
        const found = this.findByProtoFilenameAndKind(protoFilename, kind);
        if (!found) {
            let msg = `Failed to find name for file ${protoFilename} of kind "${kind}". `
                + `Searched in ${this.entries.length} files.`
            throw new Error(msg);
        }
        return found;
    }


    /**
     * Is a name (of the given kind) registered for the the given descriptor?
     */
    private has(descFile: DescFile, kind = 'default'): boolean {
        return !!this.findByProtoFilenameAndKind(descFile.proto.name, kind);
    }


    static defaultClashResolver(
        descriptor: DescFile,
        requestedName: string,
        kind: string,
        tryCount: number,
    )
        : string {

        const lastDotI = requestedName.lastIndexOf('.');
        let basename = lastDotI > 0 ? requestedName.substring(0, lastDotI) : requestedName;
        const suffix = lastDotI > 0 ? requestedName.substring(lastDotI) : '';

        basename = basename.endsWith('$') ? basename.substring(1) : basename;
        basename = basename + '$' + tryCount;
        return basename + suffix;
    }

}


interface FileTableEntry {
    desc: DescFile;
    name: string;
    kind: string;
}


type ClashResolver = (descriptor: DescFile, requestedName: string, kind: string, tryCount: number, failedName: string) => string;
