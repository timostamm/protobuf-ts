import type {DescMessage} from "@bufbuild/protobuf";
import type {File, Schema} from "../schema";
import {importMessageInterface} from "./message-interface";
import {createImportSymbol, createJsDocBlock, createLiteralString} from "@bufbuild/protoplugin-print";
import {LongType} from "@protobuf-ts/runtime";

export function printGoogleTypeMethods(schema: Schema, file: File, desc: DescMessage): void {
    function getLocalFieldName(fieldProtoName: string): string {
        const field = desc.fields.find(field => field.name === fieldProtoName);
        if (!field) {
            throw new Error(`Unknown field ${fieldProtoName} on ${desc}`);
        }
        return schema.interpreter.getFieldInfo(field).localName;
    }
    const DateTime = importMessageInterface(desc);
    const PbLong = createImportSymbol("PbLong", "@protobuf-ts/runtime", false);
    let longConvertMethod = 'toBigInt';
    if (schema.options.normalLongType === LongType.NUMBER)
        longConvertMethod = 'toNumber';
    else if (schema.options.normalLongType === LongType.STRING)
        longConvertMethod = 'toString';
    switch (desc.typeName) {
        case "google.type.Color":
            const Color = importMessageInterface(desc);
            file.println(createJsDocBlock([
                "Returns hexadecimal notation of the color: #RRGGBB[AA]",
                "",
                "R (red), G (green), B (blue), and A (alpha) are hexadecimal characters",
                "(0–9, A–F). A is optional. For example, #ff0000 is equivalent to",
                "#ff0000ff.",
                "",
                "See https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#RGB_colors"
            ].join("\n"), "    "));
            file.println("    toHex(message: ", Color, "): string {");
            file.println("        let hex = [");
            file.println("            message.red.toString(16),");
            file.println("            message.green.toString(16),");
            file.println("            message.blue.toString(16),");
            file.println("        ];");
            file.println("        if (message.alpha) {");
            file.println("            let alpha = Math.max(Math.min(message.alpha.value, 1), 0);");
            file.println("            hex.push(Math.round(alpha * 255).toString(16));");
            file.println("        }");
            file.println('        return "#" + hex.map(i => i.length < 2 ? "0" + i : i).join("");');
            file.println("    }");
            file.println(createJsDocBlock([
                "Parses a hexadecimal color notation.",
                "",
                "Recognizes the following forms:",
                "- three-digit  (#RGB)",
                "- six-digit (#RRGGBB)",
                "- four-digit  (#RGBA)",
                "- eight-digit (#RRGGBBAA)"
            ].join("\n"), "    "));
            file.println("    fromHex(hex: string): ", Color, " {");
            file.println("        if (/^#(?:[0-9a-fA-F]{3}){1}$/.test(hex)) {");
            file.println("            // #RGB");
            file.println("            return {");
            file.println("                red: parseInt(hex.substring(1, 2) + hex.substring(1, 2), 16),");
            file.println("                green: parseInt(hex.substring(2, 3) + hex.substring(2, 3), 16),");
            file.println("                blue: parseInt(hex.substring(3, 4) + hex.substring(3, 4), 16),");
            file.println("            };");
            file.println("        } else if (/^#(?:[0-9a-fA-F]{3}){2}$/.test(hex)) {");
            file.println("            // #RRGGBB");
            file.println("            return {");
            file.println("                red: parseInt(hex.substring(1, 3), 16),");
            file.println("                green: parseInt(hex.substring(3, 5), 16),");
            file.println("                blue: parseInt(hex.substring(5, 7), 16),");
            file.println("            };");
            file.println("        } else if (/^#(?:[0-9a-fA-F]{4}){1}$/.test(hex)) {");
            file.println("            // #RGBA");
            file.println("            return {");
            file.println("                red: parseInt(hex.substring(1, 2) + hex.substring(1, 2), 16),");
            file.println("                green: parseInt(hex.substring(2, 3) + hex.substring(2, 3), 16),");
            file.println("                blue: parseInt(hex.substring(3, 4) + hex.substring(3, 4), 16),");
            file.println("                alpha: {");
            file.println("                    value: parseInt(hex.substring(4, 5) + hex.substring(4, 5), 16) / 255,");
            file.println("                }");
            file.println("            };");
            file.println("        } else if (/^#(?:[0-9a-fA-F]{4}){2}$/.test(hex)) {");
            file.println("            // #RRGGBBAA");
            file.println("            return {");
            file.println("                red: parseInt(hex.substring(1, 3), 16),");
            file.println("                green: parseInt(hex.substring(3, 5), 16),");
            file.println("                blue: parseInt(hex.substring(5, 7), 16),");
            file.println("                alpha: {");
            file.println("                    value: parseInt(hex.substring(7, 9), 16) / 255,");
            file.println("                }");
            file.println("            };");
            file.println("        }");
            file.println('        throw new Error("invalid hex color");');
            file.println("    }");
            break;
        case "google.type.Date":
            const Date = importMessageInterface(desc);
            file.println(createJsDocBlock([
                "Creates a javascript Date object from the message.",
                "",
                "If you do not provide the optional parameters for time,",
                "the current time is used.",
            ].join("\n"), "    "));
            file.println("    toJsDate(message: ", Date, ", hours?: number, minutes?: number, seconds?: number, ms?: number): globalThis.Date {");
            file.println("        let now = new globalThis.Date();");
            file.println("        return new globalThis.Date(");
            file.println("            message.year,");
            file.println("            message.month - 1,");
            file.println("            message.day,");
            file.println("            hours ?? now.getHours(),");
            file.println("            minutes ?? now.getMinutes(),");
            file.println("            seconds ?? now.getSeconds(),");
            file.println("            ms ?? now.getMilliseconds(),");
            file.println("        );");
            file.println("    }");
            file.println(createJsDocBlock("Creates a Date message from a javascript Date object.", "    "));
            file.println("    fromJsDate(date: globalThis.Date): ", Date, " {");
            file.println("        return {");
            file.println("            year: date.getFullYear(),");
            file.println("            month: date.getMonth() + 1,");
            file.println("            day: date.getDate(),");
            file.println("        };");
            file.println("    }");
            break;
        case "google.type.DateTime":
            const utcOffsetField = getLocalFieldName("utc_offset");
            const timeZoneField = getLocalFieldName("time_zone");
            file.println(createJsDocBlock("Creates `DateTime` for the current time.", "    "));
            file.println("    now(): ", DateTime, " {");
            file.println("        return this.fromJsDate(new globalThis.Date());");
            file.println("    }");
            file.println(createJsDocBlock([
                "Creates a javascript Date object from the message.",
                "",
                "If a the message has a UTC offset, the javascript Date is converted",
                "into your local time zone, because javascript Dates are always in the",
                "local time zone.",
                "",
                "If the message has an offset given as an IANA timezone id, an error is",
                "thrown, because javascript has no on-board support for IANA time zone",
                "ids.",
            ].join("\n"), "    "));
            file.println("    toJsDate(message: ", DateTime, "): globalThis.Date {");
            file.println("        let dt = new globalThis.Date(");
            file.println("        		message.year,");
            file.println("        		message.month - 1,");
            file.println("        		message.day,");
            file.println("        		message.hours,");
            file.println("        		message.minutes,");
            file.println("        		message.seconds,");
            file.println("        		message.nanos / 1000,");
            file.println("        	),");
            file.println("        	to = message.timeOffset;");
            file.println("        if (to) {");
            file.println("        	if (to.oneofKind === ", createLiteralString(timeZoneField), ")");
            file.println('        		throw new globalThis.Error("IANA time zone not supported");');
            file.println("        	if (to.oneofKind === ", createLiteralString(utcOffsetField), ") {");
            file.println("        		let s = ", PbLong, ".from(to.", utcOffsetField, ".seconds).toNumber();");
            file.println("        		dt = new globalThis.Date(dt.getTime() - (s * 1000));");
            file.println("        	}");
            file.println("        }");
            file.println("        return dt;");
            file.println("    }");
            file.println(createJsDocBlock([
                "Creates a Date message from a javascript Date object.",
                "",
                "Values are in local time and a proper UTF offset is provided.",
            ].join("\n"), "    "));
            file.println("    fromJsDate(date: globalThis.Date): ", DateTime, " {");
            file.println("        return {");
            file.println("        	year: date.getFullYear(),");
            file.println("        	month: date.getMonth() + 1,");
            file.println("        	day: date.getDate(),");
            file.println("        	hours: date.getHours(),");
            file.println("        	minutes: date.getMinutes(),");
            file.println("        	seconds: date.getSeconds(),");
            file.println("        	nanos: date.getMilliseconds() * 1000,");
            file.println("        	timeOffset: {");
            file.println("        		oneofKind: ", createLiteralString(utcOffsetField), ",");
            file.println("        		", utcOffsetField, ": {");
            file.println("        			seconds: ", PbLong, ".from(date.getTimezoneOffset() * 60).", longConvertMethod, "(),");
            file.println("        			nanos: 0,");
            file.println("        		}");
            file.println("        	}");
            file.println("        };");
            file.println("    }");
            break;
        case "google.type.TimeOfDay":
            const TimeOfDay = importMessageInterface(desc);
            file.println(createJsDocBlock("Creates a TimeOfDay message from a javascript Date object.", "    "));
            file.println("    fromJsDate(date: globalThis.Date): ", TimeOfDay, " {");
            file.println("        return {");
            file.println("            hours: date.getHours(),");
            file.println("            minutes: date.getMinutes(),");
            file.println("            seconds: date.getSeconds(),");
            file.println("            nanos: date.getMilliseconds() * 1000,");
            file.println("        };");
            file.println("    }");
            break;
    }
}