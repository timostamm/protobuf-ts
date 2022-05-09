import {MethodInfo, normalizeMethodInfo, PartialMethodInfo, ServiceInfo} from "./reflection-info";
import type {JsonValue} from "@chippercash/protobuf-runtime";



export class ServiceType implements ServiceInfo {

    /**
     * The protobuf type name of the service, including package name if
     * present.
     */
    readonly typeName: string;

    /**
     * Information for each rpc method of the service, in the order of
     * declaration in the source .proto.
     */
    readonly methods: MethodInfo[];

    /**
     * Contains custom service options from the .proto source in JSON format.
     */
    readonly options: JsonOptionsMap;


    constructor(typeName: string, methods: PartialMethodInfo[], options?: JsonOptionsMap) {
        this.typeName = typeName;
        this.methods = methods.map(i => normalizeMethodInfo(i, this));
        this.options = options ?? {};
    }
}


type JsonOptionsMap = {
    [extensionName: string]: JsonValue;
};
