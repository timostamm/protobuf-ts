import {GeneratedFile, ServiceDescriptorProto, SymbolTable} from "../src";


describe('SymbolTable', function () {


    const t1 = ServiceDescriptorProto.create({name: "t1"});
    const f1: GeneratedFile = {
        getFilename: () => "f1",
        getContent: () => "f1",
    };


    it('should register with and without kind at the same time', () => {
        const t = new SymbolTable();
        t.register("t1", t1, f1);
        t.register("t1-x", t1, f1, "x");
        expect(t.has(t1)).toBeTrue();
        expect(t.has(t1, "default")).toBeTrue();
        expect(t.has(t1, "x")).toBeTrue();
    });


});

