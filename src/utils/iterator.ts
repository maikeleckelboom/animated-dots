
/**
 * Checks if object is iterable
 * @param obj
 * @returns {boolean}
 */
export function isIterable(obj) {
    if (obj == null) return false;
    return typeof obj[Symbol.iterator] === 'function';
}