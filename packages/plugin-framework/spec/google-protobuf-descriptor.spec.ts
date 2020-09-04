import {getFixtureCodeGeneratorRequest} from "./support/helpers";
import {fixtures} from "../../test-fixtures";
import {DescriptorProto, DescriptorRegistry} from "../src/";
import {assert} from "@protobuf-ts/runtime";


describe('google/protobuf/descriptor.ts', function () {


    let registry = DescriptorRegistry.createFrom(getFixtureCodeGeneratorRequest({}));


    describe('provides deprecation info as expected by fixture', function () {

        fixtures.usingDeprecation((typeName, explicitlyDeprecated, implicitlyDeprecated, deprecatedFieldNames) => {

            if (explicitlyDeprecated) {

                it(`${typeName}`, function () {
                    let descriptor = registry.resolveTypeName(typeName);
                    assert(DescriptorProto.is(descriptor));
                    expect(descriptor.options?.deprecated)
                        .toBe(true, `${typeName} should be deprecated`);
                });

            } else if (implicitlyDeprecated) {

                it(`${typeName}`, function () {
                    let descriptor = registry.resolveTypeName(typeName);
                    let file = registry.fileOf(descriptor);
                    assert(DescriptorProto.is(descriptor));
                    expect(descriptor.options?.deprecated ?? false)
                        .toBe(false, `${typeName} should not be deprecated`);
                    expect(file.options?.deprecated)
                        .toBe(true, `${typeName}'s file ${file.name} should be deprecated`);
                });

            } else {

                it(`${typeName}`, function () {
                    let descriptor = registry.resolveTypeName(typeName);
                    let file = registry.fileOf(descriptor);
                    assert(DescriptorProto.is(descriptor));
                    expect(descriptor.options?.deprecated ?? false)
                        .toBe(false, `${typeName} should not be deprecated`);
                    expect(file.options?.deprecated ?? false)
                        .toBe(false, `${typeName}'s file ${file.name} should not be deprecated`);
                });

            }


            let descriptor = registry.resolveTypeName(typeName);
            assert(DescriptorProto.is(descriptor));
            for (let field of descriptor.field) {

                it(`${typeName}.${field.name}`, function () {
                    expect(field.options?.deprecated ?? false).toBe(deprecatedFieldNames.includes(field.name ?? ''));
                });
            }


        });

    });


});

