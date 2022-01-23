import {isDate, parse} from "date-fns";

/**
 * Parses a date string using date-fns
 * @param value
 * @param originalValue
 * @returns {*|Date}
 */
export function parseDateString(value, originalValue) {
    return isDate(originalValue)
        ? originalValue
        : parse(originalValue, "yyyy-MM-dd", new Date());
}