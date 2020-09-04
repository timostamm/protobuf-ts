/**
 * assert that condition is true or throw error (with message)
 */
export function assert(condition: any, msg?: string): asserts condition {
    if (!condition) {
        throw new Error(msg);
    }
}

/**
 * assert that value cannot exist = type `never`. throw runtime error if it does.
 */
export function assertNever(value: never, msg?: string): never {
    throw new Error(msg ?? 'Unexpected object: ' + value);
}


const
    FLOAT32_MAX =  3.4028234663852886e+38,
    FLOAT32_MIN = -3.4028234663852886e+38,
    UINT32_MAX = 0xFFFFFFFF,
    INT32_MAX = 0X7FFFFFFF,
    INT32_MIN = -0X80000000;


export function assertInt32(arg: any): asserts arg is number {
    if (typeof arg !== "number")
        throw new Error('invalid int 32: ' + typeof arg);
    if (!Number.isInteger(arg) || arg > INT32_MAX || arg < INT32_MIN)
        throw new Error('invalid int 32: ' + arg);
}

export function assertUInt32(arg: any): asserts arg is number {
    if (typeof arg !== "number")
        throw new Error('invalid uint 32: ' + typeof arg);
    if (!Number.isInteger(arg) || arg > UINT32_MAX || arg < 0)
        throw new Error('invalid uint 32: ' + arg);
}

export function assertFloat32(arg: any): asserts arg is number {
    if (typeof arg !== "number")
        throw new Error('invalid float 32: ' + typeof arg);
    if (!Number.isFinite(arg))
        return;
    if (arg > FLOAT32_MAX || arg < FLOAT32_MIN)
        throw new Error('invalid float 32: ' + arg);
}
