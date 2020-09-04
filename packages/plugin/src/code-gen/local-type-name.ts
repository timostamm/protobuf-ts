import {AnyTypeDescriptorProto, FileDescriptorProto, IDescriptorTree} from "@protobuf-ts/plugin-framework";
import {assert} from "@protobuf-ts/runtime";


const reservedKeywords = 'break,case,catch,class,const,continue,debugger,default,delete,do,else,enum,export,extends,false,finally,for,function,if,import,in,instanceof,new,null,return,super,switch,this,throw,true,try,typeof,var,void,while,with,as,implements,interface,let,package,private,protected,public,static,yield,any,boolean,constructor,declare,get,module,require,number,set,string,symbol,type,from,of'.split(',');
const reservedTypeNames = 'Long,Uint8Array,array,Array,string,String,number,Number,boolean,Boolean,bigint,BigInt'.split(',');
const escapeCharacter = '$';


/**
 * Create a name for an enum, message or service.
 * - ignores package
 * - nested types get the names merged with '_'
 * - reserved words are escaped by adding '$' at the end
 * - does *not* prevent clashes, for example clash
 *   of merged nested name with other message name
 */
export function createLocalTypeName(descriptor: AnyTypeDescriptorProto, treeLookup: IDescriptorTree): string {
    // build name components for parent types
    const components = [];
    for (const ancestor of treeLookup.ancestorsOf(descriptor)) {
        if (FileDescriptorProto.is(ancestor)) {
            continue;
        }
        const name = ancestor.name;
        assert(name !== undefined);
        components.push(name);
    }

    // add name for actual descriptor
    const name = descriptor.name;
    assert(name !== undefined);
    components.push(name);

    // join all components with underscore
    let fullName = components.join('_');

    // escape if reserved
    if (reservedKeywords.includes(fullName)) {
        fullName = fullName + escapeCharacter;
    }
    if (reservedTypeNames.includes(fullName)) {
        fullName = fullName + escapeCharacter;
    }
    return fullName;
}

