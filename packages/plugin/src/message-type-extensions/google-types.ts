import {
    DescriptorProto,
    ITypeNameLookup,
    TypescriptFile,
    TypeScriptImports,
    typescriptMethodFromText
} from "@protobuf-ts/plugin-framework";
import * as ts from "typescript";
import {LongType} from "@protobuf-ts/runtime";
import {CustomMethodGenerator} from "../code-gen/message-type-generator";
import { FieldInfoGenerator } from "../code-gen/field-info-generator";


export class GoogleTypes implements CustomMethodGenerator {

    constructor(
        private readonly typeNameLookup: ITypeNameLookup,
        private readonly imports: TypeScriptImports,
        private readonly options: { normalLongType: LongType; runtimeImportPath: string; useProtoFieldName: boolean },
    ) {
    }


    /**
     * Create custom methods for the handlers of some google types.
     */
    make(source: TypescriptFile, descriptor: DescriptorProto): ts.MethodDeclaration[] {
        const
            typeName = this.typeNameLookup.makeTypeName(descriptor),
            fn = this[typeName as keyof this] as unknown as (source: TypescriptFile, descriptor: DescriptorProto) => void | string | string[];
        if (fn) {
            let r = fn.apply(this, [source, descriptor]);
            if (typeof r == "string") {
                return [typescriptMethodFromText(r)];
            }
            if (Array.isArray(r)) {
                return r.map(txt => typescriptMethodFromText(txt));
            }
        }
        return [];
    }


    ['google.type.Color'](source: TypescriptFile, descriptor: DescriptorProto) {
        const Color = this.imports.type(source, descriptor);
        return [
            `
            /**
             * Returns hexadecimal notation of the color: #RRGGBB[AA]
             *
             * R (red), G (green), B (blue), and A (alpha) are hexadecimal characters
             * (0–9, A–F). A is optional. For example, #ff0000 is equivalent to
             * #ff0000ff.
             *
             * See https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#RGB_colors
             */
            function toHex(message: ${Color}): string {
                let hex = [
                    message.red.toString(16),
                    message.green.toString(16),
                    message.blue.toString(16),
                ];
                if (message.alpha) {
                    let alpha = Math.max(Math.min(message.alpha.value, 1), 0);
                    hex.push(Math.round(alpha * 255).toString(16));
                }
                return '#' + hex.map(i => i.length < 2 ? '0' + i : i).join('');
            }
            `,
            `
            /**
             * Parses a hexadecimal color notation.
             *
             * Recognizes the following forms:
             * - three-digit  (#RGB)
             * - six-digit (#RRGGBB)
             * - four-digit  (#RGBA)
             * - eight-digit (#RRGGBBAA)
             */
            function fromHex(hex: string): ${Color} {
                if (/^#(?:[0-9a-fA-F]{3}){1}$/.test(hex)) {
                    // #RGB
                    return {
                        red: parseInt(hex.substring(1, 2) + hex.substring(1, 2), 16),
                        green: parseInt(hex.substring(2, 3) + hex.substring(2, 3), 16),
                        blue: parseInt(hex.substring(3, 4) + hex.substring(3, 4), 16),
                    };
        
                } else if (/^#(?:[0-9a-fA-F]{3}){2}$/.test(hex)) {
                    // #RRGGBB
                    return {
                        red: parseInt(hex.substring(1, 3), 16),
                        green: parseInt(hex.substring(3, 5), 16),
                        blue: parseInt(hex.substring(5, 7), 16),
                    };
        
                } else if (/^#(?:[0-9a-fA-F]{4}){1}$/.test(hex)) {
                    // #RGBA
                    return {
                        red: parseInt(hex.substring(1, 2) + hex.substring(1, 2), 16),
                        green: parseInt(hex.substring(2, 3) + hex.substring(2, 3), 16),
                        blue: parseInt(hex.substring(3, 4) + hex.substring(3, 4), 16),
                        alpha: {
                            value: parseInt(hex.substring(4, 5) + hex.substring(4, 5), 16) / 255,
                        }
                    };
        
                } else if (/^#(?:[0-9a-fA-F]{4}){2}$/.test(hex)) {
                    // #RRGGBBAA
                    return {
                        red: parseInt(hex.substring(1, 3), 16),
                        green: parseInt(hex.substring(3, 5), 16),
                        blue: parseInt(hex.substring(5, 7), 16),
                        alpha: {
                            value: parseInt(hex.substring(7, 9), 16) / 255,
                        }
                    };
                }
                throw new Error('invalid hex color');
            }
            `,
        ];
    }

    ['google.type.Date'](source: TypescriptFile, descriptor: DescriptorProto) {
        const Date = this.imports.type(source, descriptor);
        return [
            `
            /**
             * Creates a javascript Date object from the message.
             *
             * If you do not provide the optional parameters for time,
             * the current time is used.
             */
            function toJsDate(message: ${Date}, hours?: number, minutes?: number, seconds?: number, ms?: number): globalThis.Date {
                let now = new globalThis.Date();
                return new globalThis.Date(
                    message.year,
                    message.month - 1,
                    message.day,
                    hours ?? now.getHours(),
                    minutes ?? now.getMinutes(),
                    seconds ?? now.getSeconds(),
                    ms ?? now.getMilliseconds(),
                );
            }
            `, `
            /**
             * Creates a Date message from a javascript Date object. 
             */
            function fromJsDate(date: globalThis.Date): ${Date} {
                return {
                    year: date.getFullYear(),
                    month: date.getMonth() + 1,
                    day: date.getDate(),
                };
            }
            `,
        ];
    }

    ['google.type.DateTime'](source: TypescriptFile, descriptor: DescriptorProto) {
        const DateTime = this.imports.type(source, descriptor);
        const PbLong = this.imports.name(source, 'PbLong', this.options.runtimeImportPath);
        let longConvertMethod = 'toBigInt';
        if (this.options.normalLongType === LongType.NUMBER)
            longConvertMethod = 'toNumber';
        else if (this.options.normalLongType === LongType.STRING)
            longConvertMethod = 'toString';
        const utcOffsetField = FieldInfoGenerator.createTypescriptLocalName('utc_offset', this.options),
              timeOffsetField = FieldInfoGenerator.createTypescriptLocalName('time_offset', this.options),
              timeZoneField = FieldInfoGenerator.createTypescriptLocalName('time_zone', this.options);
        return [
            `
            /**
             * Creates \`DateTime\` for the current time.
             */
            function now(): ${DateTime} {
                return this.fromJsDate(new globalThis.Date());
            }
            `, `
            /**
             * Creates a javascript Date object from the message.
             *
             * If a the message has a UTC offset, the javascript Date is converted
             * into your local time zone, because javascript Dates are always in the
             * local time zone.
             *
             * If the message has an offset given as an IANA timezone id, an error is
             * thrown, because javascript has no on-board support for IANA time zone
             * ids.
             */
            function toJsDate(message: ${DateTime}): globalThis.Date {
                let dt = new globalThis.Date(
                        message.year,
                        message.month - 1,
                        message.day,
                        message.hours,
                        message.minutes,
                        message.seconds,
                        message.nanos / 1000,
                    ),
                    to = message.${timeOffsetField};
                if (to) {
                    if (to.oneofKind === "${timeZoneField}")
                        throw new globalThis.Error("IANA time zone not supported");
                    if (to.oneofKind === "${utcOffsetField}") {
                        let s = ${PbLong}.from(to.${utcOffsetField}.seconds).toNumber();
                        dt = new globalThis.Date(dt.getTime() - (s * 1000));
                    }
                }
                return dt;
            }
            `, `
            /**
             * Creates a Date message from a javascript Date object.
             *  
             * Values are in local time and a proper UTF offset is provided.
             */
            function fromJsDate(date: globalThis.Date): ${DateTime} {
                return {
                    year: date.getFullYear(),
                    month: date.getMonth() + 1,
                    day: date.getDate(),
                    hours: date.getHours(),
                    minutes: date.getMinutes(),
                    seconds: date.getSeconds(),
                    nanos: date.getMilliseconds() * 1000,
                    ${timeOffsetField}: {
                        oneofKind: "${utcOffsetField}",
                        ${utcOffsetField}: {
                            seconds: ${PbLong}.from(date.getTimezoneOffset() * 60).${longConvertMethod}(),
                            nanos: 0,
                        }
                    }
                };
            }
            `,
        ];
    }

    ['google.type.TimeOfDay'](source: TypescriptFile, descriptor: DescriptorProto) {
        const TimeOfDay = this.imports.type(source, descriptor);
        return [
            `
            /**
             * Creates a TimeOfDay message from a javascript Date object.
             */
            function fromJsDate(date: globalThis.Date): ${TimeOfDay} {
                return {
                    hours: date.getHours(),
                    minutes: date.getMinutes(),
                    seconds: date.getSeconds(),
                    nanos: date.getMilliseconds() * 1000,
                };
            }
            `,
        ];
    }

}
