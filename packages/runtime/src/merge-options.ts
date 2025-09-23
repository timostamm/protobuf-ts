const MERGE_OPTIONS_DEFAULTED = Symbol.for("protobuf-ts/merge-options-defaulted");

export interface MergeOptions {
    /**
     * Merge options for map fields
     * @default MergeOptions.Map.SHALLOW
     */
    map?: MergeOptions.Map;
    /**
     * Merge options for repeated fields
     * @default MergeOptions.Repeated.REPLACE
     */
    repeated?: MergeOptions.Repeated;
    /**
     * Merge options for singular message fields
     * @default MergeOptions.ReplaceMessages.NEVER
     */
    replaceMessages?: MergeOptions.ReplaceMessages;
    /**
     * The MergeOptions have already been defaulted.
     * Avoids excess comparisons, GC.
     */
    [MERGE_OPTIONS_DEFAULTED]?: true;
}

export namespace MergeOptions {
    export type NonNullable = {
        [k in keyof MergeOptions]-?: MergeOptions[k];
    }

    /** Merge options for map fields */
    export enum Map {
        /**
         * Source will replace target 
         * ```ts
         * target = { foo: { a: 9, b: true  }, bar: { a: 8, b: true }                }
         * source = { foo: {       b: false },                         baz: { a: 1 } }
         * result = { foo: {       b: false },                         baz: { a: 1 } }
         * ```
         */
        REPLACE = 1,
        /**
         * Source will overwrite target by key
         * (canonical protobuf behavior, default for protobuf-ts)
         * ```ts
         * target = { foo: { a: 9, b: true  }, bar: { a: 8, b: true }                }
         * source = { foo: {       b: false },                         baz: { a: 1 } }
         * result = { foo: {       b: false }, bar: { a: 8, b: true }, baz: { a: 1 } }
         * ```
         */
        SHALLOW = 2,
        /**
         * Source will recursively merge
         * ```ts
         * target = { foo: { a: 9, b: true  }, bar: { a: 8, b: true } }
         * source = { foo: {       b: false },                         baz: { a: 1 } }
         * result = { foo: { a: 9, b: false }, bar: { a: 8, b: true }, baz: { a: 1 } }
         * ```
         */
        DEEP = 3,
    }

    /** Merge options for repeated fields */
    export enum Repeated {
        /**
         * Source will append to target
         * (canonical protobuf behavior)
         * ```ts
         * target = [{ a: 9, b: true  }, { a: 8, b: true }          ]
         * source = [                                       { a: 1 }]
         * result = [{ a: 9, b: true  }, { a: 8, b: true }, { a: 1 }]
         * ```
         */
        APPEND = 0,
        /**
         * Source will replace target
         * (default for protobuf-ts)
         * ```ts
         * target = [{ a: 9, b: true }, { a: 8, b: true }]
         * source = [{ a: 1          }                   ]
         * result = [{ a: 1          }                   ]
         * ```
         */
        REPLACE = 1,
        /**
         * Source will overwrite target by index
         * ```ts
         * target = [{ a: 9, b: true }, { a: 8, b: true }]
         * source = [{ a: 1          }                   ]
         * result = [{ a: 1          }, { a: 8, b: true }]
         * ```
         */
        SHALLOW = 2,
        /**
         * Source will deeply merge target by index
         * ```ts
         * target = [{ a: 9, b: true }, { a: 8, b: true }]
         * source = [{ a: 1          }                   ]
         * result = [{ a: 1, b: true }, { a: 8, b: true }]
         * ```
         */
        DEEP = 3,
    }

    /** Merge options for singular message fields */
    export enum ReplaceMessages {
        /**
         * If singlular message field in source is set, it will be
         * merged into target singular message field.
         * (canonical protobuf behavior, default for protobuf-ts)
         * ```ts
         * // when set in source
         * target = { msg: { a: 9, b: true  }, str: "A" }
         * source = { msg: {       b: false }, str: "B" }
         * result = { msg: { a: 9  b: false }, str: "B" }
         * 
         * // when unset in source
         * target = { msg: { a: 9, b: true  }, str: "A" }
         * source = {                          str: "B" }
         * result = { msg: { a: 9, b: true  }, str: "B" }
         * ```
         */
        NEVER = 0,
        /**
         * If singlular message field in source is set, it will replace
         * target singular message field.
         * ```ts
         * // when set in source
         * target = { msg: { a: 9, b: true  }, str: "A" }
         * source = { msg: {       b: false }, str: "B" }
         * result = { msg: {       b: false }, str: "B" }
         * 
         * // when unset in source
         * target = { msg: { a: 9, b: true  }, str: "A" }
         * source = {                          str: "B" }
         * result = { msg: { a: 9, b: true  }, str: "B" }
         * ```
         */
        IF_SET = 1,
        /**
         * Source singular message field will replace target singular
         * message field even if source field is unset.
         * ```ts
         * // when set in source
         * target = { msg: { a: 9, b: true  }, str: "A" }
         * source = { msg: {       b: false }, str: "B" }
         * result = { msg: {       b: false }, str: "B" }
         * 
         * // when unset in source
         * target = { msg: { a: 9, b: true  }, str: "A" }
         * source = {                          str: "B" }
         * result = {                          str: "B" }
         * ```
         */
        ALWAYS = 2,
    }

    export const defaults: MergeOptions.NonNullable = {
        map: MergeOptions.Map.SHALLOW,
        repeated: MergeOptions.Repeated.REPLACE,
        replaceMessages: MergeOptions.ReplaceMessages.NEVER,
        [MERGE_OPTIONS_DEFAULTED]: true,
    }

    export function withDefaults(o?: MergeOptions): MergeOptions.NonNullable {
        return !o ? MergeOptions.defaults : o[MERGE_OPTIONS_DEFAULTED] ? o as MergeOptions.NonNullable : {
            map: o.map ?? MergeOptions.defaults.map,
            repeated: o.repeated ?? MergeOptions.defaults.repeated,
            replaceMessages: o.replaceMessages ?? MergeOptions.defaults.replaceMessages,
            [MERGE_OPTIONS_DEFAULTED]: true
        };
    }
}
