/**
 * Use the first parameter if not null or undefined otherwise use the other option
 * @param val
 * @param def
 */
export function def<T>(val: T | null | undefined, def: T): T {
    return val != null ? val : def;
}
