import {lowerCamelCase} from "../src";


describe('lowerCamelCase()', function () {

    it('turns "Camel" into "camel"', () => {
        expect(lowerCamelCase("Camel")).toBe("camel");
    });

    it('turns "snake_case" into "snakeCase"', () => {
        expect(lowerCamelCase("snake_case")).toBe("snakeCase");
    });

});


