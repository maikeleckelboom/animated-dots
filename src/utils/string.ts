/**
 * Slugifies a string
 * @param text
 * @returns {string}
 */
export const slugify = text => text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')

/**
 * Highlights all matches
 * @param text
 * @param search
 * @returns {*}
 */
export function highlightMatches(text, search = '') {
    const matchExists = text.toLowerCase().includes(search.toLowerCase())
    if (!matchExists) return text
    const re = new RegExp(search, 'ig')
    return text.replace(re, matchedText => `<span class="matched">${matchedText}</span>`)
}

/**
 * Splits a string into an array of words
 * @param array
 * @returns {*}
 */
export function stringify(array) {
    return array.reduce((pre, next) => pre + ' ' + next)
}

/**
 * @param input
 */
const convertToString = (input) => {
    if (input) {
        if (typeof input === "string") return input
        return String(input)
    }
    return ''
}

/**
 * Converts a string to words
 * @param input
 */
export const toWords = (input) => {
    input = convertToString(input);
    const regex = /[A-Z\xC0-\xD6\xD8-\xDE]?[a-z\xDF-\xF6\xF8-\xFF]+|[A-Z\xC0-\xD6\xD8-\xDE]+(?![a-z\xDF-\xF6\xF8-\xFF])|\d+/g;
    return input.match(regex);
}

/**
 * Convert the input array to camel case
 * @param inputArray
 */
export const toCamelCase = (inputArray) => {
    let result = "";
    for (let i = 0, len = inputArray.length; i < len; i++) {
        let currentStr = inputArray[i];
        let tempStr = currentStr.toLowerCase();
        if (i !== 0) {
            // convert first letter to upper case (the word is in lowercase)
            tempStr = tempStr.substr(0, 1).toUpperCase() + tempStr.substr(1);
        }
        result += tempStr;
    }
    return result;
}

/**
 * This function calls all other functions
 *
 * @param input
 */
export const toCamelCaseString = (input) => {
    let words = toWords(input)
    return toCamelCase(words)
}