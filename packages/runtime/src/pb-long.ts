// factory for BigInt, is `undefined` when unavailable
import {int64fromString, int64toString} from "./goog-varint";

const biCtor: undefined | ((v: number | string | bigint) => bigint) = globalThis.BigInt;

// min / max values in bigint format
const LONG_MIN = biCtor ? biCtor("-9223372036854775808") : undefined;
const LONG_MAX = biCtor ? biCtor("9223372036854775807") : undefined;
const ULONG_MIN = biCtor ? biCtor("0") : undefined;
const ULONG_MAX = biCtor ? biCtor("18446744073709551615") : undefined;

// used to convert bigint from / to bits
const VIEW64 = new DataView(new ArrayBuffer(8));

// used to validate from(string) input (when bigint is unavailable)
const RE_DECIMAL_STR = /^-?[0-9]+$/;

// constants for binary math
const TWO_PWR_32_DBL = (1 << 16) * (1 << 16);


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
        if (biCtor)
            // noinspection FallThroughInSwitchStatementJS
            switch (typeof value) {

                case "string":
                    if (value == "0")
                        return this.ZERO;
                    if (value == "")
                        throw new Error('string is no integer');
                    value = biCtor(value);

                case "number":
                    if (value === 0)
                        return this.ZERO;
                    value = biCtor(value);

                case "bigint":
                    if (!value)
                        return this.ZERO;
                    if (value < ULONG_MIN!)
                        throw new Error('signed value for ulong');
                    if (value > ULONG_MAX!)
                        throw new Error('ulong too large');
                    VIEW64.setBigUint64(0, value, true);
                    return new PbULong(
                        VIEW64.getInt32(0, true),
                        VIEW64.getInt32(4, true),
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
                        throw new Error('signed value');
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
        if (biCtor)
            return this.toBigInt().toString()
        return int64toString(this.lo, this.hi);
    }

    /**
     * Convert to native bigint.
     */
    toBigInt(): bigint {
        VIEW64.setInt32(0, this.lo, true);
        VIEW64.setInt32(4, this.hi, true);
        return VIEW64.getBigUint64(0, true);
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
        if (biCtor)
            // noinspection FallThroughInSwitchStatementJS
            switch (typeof value) {
                case "string":
                    if (value == "0")
                        return this.ZERO;
                    if (value == "")
                        throw new Error('string is no integer');
                    value = biCtor(value);

                case "number":
                    if (value === 0)
                        return this.ZERO;
                    value = biCtor(value);

                case "bigint":
                    if (!value)
                        return this.ZERO;
                    if (value < LONG_MIN!)
                        throw new Error('ulong too small');
                    if (value > LONG_MAX!)
                        throw new Error('ulong too large');
                    VIEW64.setBigInt64(0, value, true);
                    return new PbLong(
                        VIEW64.getInt32(0, true),
                        VIEW64.getInt32(4, true),
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
        return (this.hi & 0x80000000) !== 0;
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
        if (biCtor)
            return this.toBigInt().toString()
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
        VIEW64.setInt32(0, this.lo, true);
        VIEW64.setInt32(4, this.hi, true);
        return VIEW64.getBigInt64(0, true);
    }

}
