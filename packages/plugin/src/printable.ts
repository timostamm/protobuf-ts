import type {PrintableTypes, StdPrintable,} from "@bufbuild/protoplugin-print";
import {createStdPrintableTypes,} from "@bufbuild/protoplugin-print";

/**
 * All types that can be passed to GeneratedFile.print()
 */
export type Printable =
  | StdPrintable
  | Printable[];

export function createPrintableTypes(): PrintableTypes<Printable> {
  return createStdPrintableTypes();
}
