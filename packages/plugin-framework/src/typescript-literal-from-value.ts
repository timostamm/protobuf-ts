import { assert, assertNever } from "@chippercash/protobuf-runtime";
import * as ts from "typescript";
import {
  DescriptorProto,
  EnumDescriptorProto,
  EnumOptions,
  EnumValueDescriptorProto,
  EnumValueOptions,
  FieldDescriptorProto,
  FieldDescriptorProto_Label,
  FieldDescriptorProto_Type,
  FieldOptions,
  FileDescriptorProto,
  FileOptions,
  MessageOptions,
  MethodDescriptorProto,
  MethodOptions,
  OneofDescriptorProto,
  OneofOptions,
  ServiceDescriptorProto,
  ServiceOptions
} from "./google/protobuf/descriptor";


export type SimpleJsValue =
  | string
  | number
  | bigint
  | boolean
  | undefined
  | null
  | SimpleJsValue[]
  | { [k: string]: SimpleJsValue }
  | TypedArray
  ;

type TypedArray =
  | Uint8Array
  | Int8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array;


const validPropertyKey = /^(?![0-9])[a-zA-Z0-9$_]+$/;


/**
 * Creates nodes for simple JavaScript values.
 *
 * Simple JavaScript values include:
 * - all primitives: number, bigint, string, boolean
 * - undefined, null
 * - plain objects containing only simple JavaScript values
 * - arrays containing only simple JavaScript values
 * - typed arrays
 */
export function typescriptLiteralFromValue (value: SimpleJsValue): ts.Expression {
  switch (typeof value) {
    case "undefined":
      return ts.createIdentifier("undefined");
    case "boolean":
      return value ? ts.createTrue() : ts.createFalse();
    case "string":
      return ts.createStringLiteral(value);
    case "bigint":
      return ts.createNumericLiteral(`${value}n`);
    case "number":
      if (isNaN(value)) {
        return ts.createPropertyAccess(
          ts.createIdentifier("Number"),
          ts.createIdentifier("Nan")
        );
      } else if (value === Number.POSITIVE_INFINITY) {
        return ts.createPropertyAccess(
          ts.createIdentifier("Number"),
          ts.createIdentifier("POSITIVE_INFINITY")
        );
      } else if (value === Number.NEGATIVE_INFINITY) {
        return ts.createPropertyAccess(
          ts.createIdentifier("Number"),
          ts.createIdentifier("NEGATIVE_INFINITY")
        );
      }
      return ts.createNumericLiteral(`${value}`);
    case "object":
      if (value === null) {
        return ts.createNull();
      }
      if (isTypedArray(value)) {
        if (value.length == 0) {
          return ts.createNew(
            ts.createIdentifier(typedArrayName(value)), undefined, [ts.createNumericLiteral("0")]
          );
        }
        let values: ts.NumericLiteral[] = [];
        for (let i = 0; i < value.length; i++) {
          values.push(ts.createNumericLiteral(value.toString()));
        }
        return ts.createNew(
          ts.createIdentifier(typedArrayName(value)), undefined, [ts.createArrayLiteral(values, false)]
        );
      }
      if (Array.isArray(value)) {
        let elements = value.map(ele => typescriptLiteralFromValue(ele));
        return ts.createArrayLiteral(elements, false);
      }
      if (value.constructor !== Object) {
        throw new Error(`got a non-plain object ${value.constructor}`);
      }
      let props: ts.PropertyAssignment[] = [];
      for (let key of Object.keys(value)) {
        let propName = validPropertyKey.test(key) ? key : ts.createStringLiteral(key);
        let propVal = typescriptLiteralFromValue(value[key]);
        props.push(
          ts.createPropertyAssignment(propName, propVal)
        );
      }
      return ts.createObjectLiteral(props, false);
  }
  assertNever(value);
}

export function typescriptLiteralFromValueAndDescriptor (value: SimpleJsValue, descriptor: DescriptorProto): ts.Expression {
  switch (typeof value) {
    case "undefined":
      return ts.createIdentifier("undefined");
    case "boolean":
      return value ? ts.createTrue() : ts.createFalse();
    case "string":
      return ts.createStringLiteral(value);
    case "bigint":
      return ts.createNumericLiteral(`${value}n`);
    case "number":
      if (isNaN(value)) {
        return ts.createPropertyAccess(
          ts.createIdentifier("Number"),
          ts.createIdentifier("Nan")
        );
      } else if (value === Number.POSITIVE_INFINITY) {
        return ts.createPropertyAccess(
          ts.createIdentifier("Number"),
          ts.createIdentifier("POSITIVE_INFINITY")
        );
      } else if (value === Number.NEGATIVE_INFINITY) {
        return ts.createPropertyAccess(
          ts.createIdentifier("Number"),
          ts.createIdentifier("NEGATIVE_INFINITY")
        );
      }
      return ts.createNumericLiteral(`${value}`);
    case "object":
      if (value === null) {
        return ts.createNull();
      }
      if (isTypedArray(value)) {
        if (value.length == 0) {
          return ts.createNew(
            ts.createIdentifier(typedArrayName(value)), undefined, [ts.createNumericLiteral("0")]
          );
        }
        let values: ts.NumericLiteral[] = [];
        for (let i = 0; i < value.length; i++) {
          values.push(ts.createNumericLiteral(value.toString()));
        }
        return ts.createNew(
          ts.createIdentifier(typedArrayName(value)), undefined, [ts.createArrayLiteral(values, false)]
        );
      }
      if (Array.isArray(value)) {
        let elements = value.map(ele => typescriptLiteralFromValue(ele));
        return ts.createArrayLiteral(elements, false);
      }
      if (value.constructor !== Object) {
        throw new Error(`got a non-plain object ${value.constructor}`);
      }
      let props: ts.PropertyAssignment[] = [];
      let oneofFieldNames = new Set<string>(['oneofkind']);
      if (descriptor.oneofDecl.length > 0) {
        for (const decl of descriptor.oneofDecl) {
          oneofFieldNames.add(removeUnderscores(decl.name!).toLowerCase())
        }
      }
      for (let key of Object.keys(value)) {
        let propName = validPropertyKey.test(key) ? key : ts.createStringLiteral(key);
        // Handle oneof cases.
        if (oneofFieldNames.has(key.toLowerCase())) {
          let propVal = typescriptLiteralFromValueAndDescriptor(value[key], descriptor);
          props.push(
            ts.createPropertyAssignment(propName, propVal)
          );
          continue;
        }
        let i = 0;
        let field = descriptor.field[i]

        while (removeUnderscores(field.name as string).toLowerCase() != key.toLowerCase()) {
          i++
          if (i >= descriptor.field.length) {
            throw new Error(`Could not find field in the descriptor that has name: ${key}`);
          }
          field = descriptor.field[i]
        }
        assert(removeUnderscores(field.name as string).toLowerCase() === key.toLowerCase())
        let fieldType = field.type
        let fieldLabel = field.label
        assert(fieldType != undefined && fieldLabel != undefined)
        if (typeof fieldType != 'number') {
          fieldType = FieldDescriptorProto_Type[fieldType] as unknown as FieldDescriptorProto_Type
        }
        if (typeof fieldLabel != 'number') {
          fieldLabel = FieldDescriptorProto_Label[fieldLabel] as unknown as FieldDescriptorProto_Label
        }
        if (fieldType == FieldDescriptorProto_Type.ENUM) {
          const fieldTypeName = getTypeNameFromFullName(field.typeName!)
          // Stop one level above the leaf nodes since enums can't have nested types.
          // `enumField: EnumType.A` and `enumField: [EnumType.A, EnumValue.B, ...]`
          const val = value[key]
          if (fieldLabel === FieldDescriptorProto_Label.REPEATED) {
            assert(Array.isArray(val))
            let expressions: ts.Expression[] = val.map(ele => {
              assert(ele != undefined && descriptor.name != undefined)
              return createEnumPropertyAccessExp(ele.toString(), fieldTypeName)
            });
            props.push(ts.createPropertyAssignment(
              propName, ts.createArrayLiteral(expressions, false)));
          } else {
            assert(val != undefined && descriptor.name != undefined)
            props.push(ts.createPropertyAssignment(
              propName, createEnumPropertyAccessExp(val.toString(), fieldTypeName))
            )
          }
        } else {
          let propVal = typescriptLiteralFromValueAndDescriptor(value[key], descriptor);
          props.push(
            ts.createPropertyAssignment(propName, propVal)
          );
        }
        i++
      }
      return ts.createObjectLiteral(props, false);
  }
  assertNever(value);
}

function removeUnderscores (str: string): string {
  const pieces = str.split('_')
  let result = ''
  for (let el of pieces) {
    result += el
  }
  return result
}

export function createEnumPropertyAccessExp (value: string, enumType: string): ts.PropertyAccessExpression {
  return ts.createPropertyAccess(
    ts.createIdentifier(enumType),
    ts.createIdentifier(value)
  )
}

export function getTypeNameFromFullName (fullName: string): string {
  const typeNamePieces = fullName!.split('.')
  return typeNamePieces[typeNamePieces.length - 1]
}


function isTypedArray (arg: any): arg is TypedArray {
  return arg instanceof Uint8Array
    || arg instanceof Int8Array
    || arg instanceof Uint8ClampedArray
    || arg instanceof Int16Array
    || arg instanceof Uint16Array
    || arg instanceof Int32Array
    || arg instanceof Uint32Array
    || arg instanceof Float32Array
    || arg instanceof Float64Array;
}


function typedArrayName (arg: TypedArray): string {
  if (arg instanceof Uint8Array) {
    return 'Uint8Array';
  }
  if (arg instanceof Int8Array) {
    return 'Int8Array';
  }
  if (arg instanceof Uint8ClampedArray) {
    return 'Uint8ClampedArray';
  }
  if (arg instanceof Int16Array) {
    return 'Int16Array';
  }
  if (arg instanceof Uint16Array) {
    return 'Uint16Array';
  }
  if (arg instanceof Int32Array) {
    return 'Int32Array';
  }
  if (arg instanceof Uint32Array) {
    return 'Uint32Array';
  }
  if (arg instanceof Float32Array) {
    return 'Float32Array';
  }
  return 'Float64Array';
}
