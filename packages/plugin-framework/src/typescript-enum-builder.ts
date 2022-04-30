import * as ts from "typescript";
import * as rt from "@protobuf-ts/runtime";
import { addCommentBlockAsJsDoc } from "./typescript-comments";


/**
 * Creates an enum declaration.
 */
export class TypescriptEnumBuilder {


  private readonly values: Array<{ name: string, number: number, comment?: string }> = [];


  add (name: string, number: number, comment?: string) {
    this.values.push({ name, number, comment });
  }

  build (name: string | ts.Identifier, modifiers?: readonly ts.Modifier[]): ts.EnumDeclaration {
    this.validate();
    const members: ts.EnumMember[] = [];
    // const assignments: ts.PropertyAssignment[] = []
    for (let { name, number, comment } of this.values) {
      let member = ts.createEnumMember(
        ts.createIdentifier(name),
        // ts.createNumericLiteral(number.toString())
        ts.createStringLiteral(name)
      );
      /*const assignment: ts.PropertyAssignment = ts.createPropertyAssignment(
        ts.createIdentifier(name),
        ts.createStringLiteral(name)
      );*/

      if (comment) {
        addCommentBlockAsJsDoc(member, comment);
      }
      members.push(member);
      // assignments.push(assignment);
    }
    /*let expr: any = ts.createExpressionStatement(ts.createObjectLiteral(assignments, true))
    console.log(expr._statementBrand)
    expr._expressionBrand = expr._statementBrand
    return ts.createExportDeclaration(
      undefined,
      modifiers,
      undefined,
      expr
    )*/
    // return ts.createExpressionStatement(ts.createObjectLiteral(assignments, true))
    return ts.createEnumDeclaration(
      undefined,
      modifiers,
      name,
      members
    );
  }


  private validate () {
    if (this.values.map(v => v.name).some((name, i, a) => a.indexOf(name) !== i))
      throw new Error("duplicate names");
    let ei: rt.EnumInfo[1] = {};
    for (let v of this.values) {
      ei[v.number] = v.name;
      ei[v.name] = v.number;
    }
    if (!rt.isEnumObject(ei)) {
      throw new Error("not a typescript enum object");
    }
  }

}
