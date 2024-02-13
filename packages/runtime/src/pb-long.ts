import {int64fromString, int64toString} from "./goog-varint";


/**
 * API for supported BigInt on current platform.
 */
interface BiSupport {

    /**
     * Minimum signed value.
     */
    MIN: bigint;

    /**
     * Maximum signed value.
     */
    MAX: bigint;

    /**
     * Minimum unsigned value.
     */
    UMIN: bigint;

    /**
     * Maximum unsigned value.
     */
    UMAX: bigint;

    /**
     * A data view that is guaranteed to have the methods
     * - getBigInt64
     * - getBigUint64
     * - setBigInt64
     * - setBigUint64
     */
    V: DataView;

    /**
     * The BigInt constructor function.
     */
    C(v: number | string | bigint): bigint;
}

let BI: BiSupport | undefined;

export function detectBi(): void {
    const dv = new DataView(new ArrayBuffer(8));
    const ok = globalThis.BigInt !== undefined
        && typeof dv.getBigInt64 === "function"
        && typeof dv.getBigUint64 === "function"
        && typeof dv.setBigInt64 === "function"
        && typeof dv.setBigUint64 === "function";
    BI = ok ? {
        MIN: BigInt("-9223372036854775808"),
        MAX: BigInt("9223372036854775807"),
        UMIN: BigInt("0"),
        UMAX: BigInt("18446744073709551615"),
        C: BigInt,
        V: dv,
    } : undefined;
}

detectBi();

function assertBi(bi: BiSupport | undefined): asserts bi is BiSupport {
    if (!bi) throw new Error("BigInt unavailable, see https://github.com/timostamm/protobuf-ts/blob/v1.0.8/MANUAL.md#bigint-support");
}

// used to validate from(string) input (when bigint is unavailable)
const RE_DECIMAL_STR = /^-?[0-9]+$/;

// constants for binary math
const TWO_PWR_32_DBL = 0x100000000;
const HALF_2_PWR_32  = 0x080000000;


// base class for PbLong and PbULong provides shared code
abstract class SharedPbLong {

    /**
     * Low 32 bits.
     */
    readonly lo: number;

    /**
     * High 32 bits.
     */
    readonly hi: number;

    /**
     * Create a new instance with the given bits.
     */
    constructor(lo: number, hi: number) {
        this.lo = lo | 0;
        this.hi = hi | 0;
    }

    /**
     * Is this instance equal to 0?
     */
    isZero(): boolean {
        return this.lo == 0 && this.hi == 0;
    }

    /**
     * Convert to a native number.
     */
    toNumber(): number {
        let result = this.hi * TWO_PWR_32_DBL + (this.lo >>> 0);
        if (!Number.isSafeInteger(result))
            throw new Error("cannot convert to safe number")
        return result;
    }

    /**
     * Convert to decimal string.
     */
    abstract toString(): string;

    /**
     * Convert to native bigint.
     */
    abstract toBigInt(): bigint;
}


/**
 * 64-bit unsigned integer as two 32-bit values.
 * Converts between `string`, `number` and `bigint` representations.
 */
export class PbULong extends SharedPbLong {

    /**
     * ulong 0 singleton.
     */
    static ZERO = new PbULong(0, 0);

    /**
     * Create instance from a `string`, `number` or `bigint`.
     */
    static from(value: string | number | bigint): PbULong {
        if (BI)
            // noinspection FallThroughInSwitchStatementJS
            switch (typeof value) {

                case "string":
                    if (value == "0")
                        return this.ZERO;
                    if (value == "")
                        throw new Error('string is no integer');
                    value = BI.C(value);

                case "number":
                    if (value === 0)
                        return this.ZERO;
                    value = BI.C(value);

                case "bigint":
                    if (!value)
                        return this.ZERO;
                    if (value < BI.UMIN)
                        throw new Error('signed value for ulong');
                    if (value > BI.UMAX)
                        throw new Error('ulong too large');
                    BI.V.setBigUint64(0, value, true);
                    return new PbULong(
                        BI.V.getInt32(0, true),
                        BI.V.getInt32(4, true),
                    );

            }
        else
            switch (typeof value) {

                case "string":
                    if (value == "0")
                        return this.ZERO;
                    value = value.trim();
                    if (!RE_DECIMAL_STR.test(value))
                        throw new Error('string is no integer');
                    let [minus, lo, hi] = int64fromString(value);
                    if (minus)
                        throw new Error('signed value for ulong');
                    return new PbULong(lo, hi);

                case "number":
                    if (value == 0)
                        return this.ZERO;
                    if (!Number.isSafeInteger(value))
                        throw new Error('number is no integer');
                    if (value < 0)
                        throw new Error('signed value for ulong');
                    return new PbULong(value, value / TWO_PWR_32_DBL);

            }
        throw new Error('unknown value ' + typeof value);
    }

    /**
     * Convert to decimal string.
     */
    toString() {
        return BI ? this.toBigInt().toString() : int64toString(this.lo, this.hi);
    }

    /**
     * Convert to native bigint.
     */
    toBigInt(): bigint {
        assertBi(BI);
        BI.V.setInt32(0, this.lo, true);
        BI.V.setInt32(4, this.hi, true);
        return BI.V.getBigUint64(0, true);
    }

}


/**
 * 64-bit signed integer as two 32-bit values.
 * Converts between `string`, `number` and `bigint` representations.
 */
export class PbLong extends SharedPbLong {

    /**
     * long 0 singleton.
     */
    static ZERO = new PbLong(0, 0);

    /**
     * Create instance from a `string`, `number` or `bigint`.
     */
    static from(value: string | number | bigint): PbLong {
        if (BI)
            // noinspection FallThroughInSwitchStatementJS
            switch (typeof value) {
                case "string":
                    if (value == "0")
                        return this.ZERO;
                    if (value == "")
                        throw new Error('string is no integer');
                    value = BI.C(value);

                case "number":
                    if (value === 0)
                        return this.ZERO;
                    value = BI.C(value);

                case "bigint":
                    if (!value)
                        return this.ZERO;
                    if (value < BI.MIN)
                        throw new Error('signed long too small');
                    if (value > BI.MAX)
                        throw new Error('signed long too large');
                    BI.V.setBigInt64(0, value, true);
                    return new PbLong(
                        BI.V.getInt32(0, true),
                        BI.V.getInt32(4, true),
                    );
            }
        else
            switch (typeof value) {

                case "string":
                    if (value == "0")
                        return this.ZERO;
                    value = value.trim();
                    if (!RE_DECIMAL_STR.test(value))
                        throw new Error('string is no integer');
                    let [minus, lo, hi] = int64fromString(value);
                    if (minus) {
                        if (hi > HALF_2_PWR_32 || (hi == HALF_2_PWR_32 && lo != 0))
                            throw new Error('signed long too small');
                    } else if (hi >= HALF_2_PWR_32)
                        throw new Error('signed long too large');
                    let pbl = new PbLong(lo, hi);
                    return minus ? pbl.negate() : pbl;

                case "number":
                    if (value == 0)
                        return this.ZERO;
                    if (!Number.isSafeInteger(value))
                        throw new Error('number is no integer');
                    return value > 0
                        ? new PbLong(value, value / TWO_PWR_32_DBL)
                        : new PbLong(-value, -value / TWO_PWR_32_DBL).negate();
            }
        throw new Error('unknown value ' + typeof value);
    }

    /**
     * Do we have a minus sign?
     */
    isNegative(): boolean {
        return (this.hi & HALF_2_PWR_32) !== 0;
    }

    /**
     * Negate two's complement.
     * Invert all the bits and add one to the result.
     */
    negate(): PbLong {
        let hi = ~this.hi, lo = this.lo;
        if (lo)
            lo = ~lo + 1;
        else
            hi += 1;
        return new PbLong(lo, hi);
    }

    /**
     * Convert to decimal string.
     */
    toString() {
        if (BI)
            return this.toBigInt().toString();
        if (this.isNegative()) {
            let n = this.negate();
            return '-' + int64toString(n.lo, n.hi);
        }
        return int64toString(this.lo, this.hi);
    }

    /**
     * Convert to native bigint.
     */
    toBigInt(): bigint {
        assertBi(BI);
        BI.V.setInt32(0, this.lo, true);
        BI.V.setInt32(4, this.hi, true);
        return BI.V.getBigInt64(0, true);
    }

}
