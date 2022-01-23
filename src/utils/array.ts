/**
 * Groups an array of objects by given key.
 * @param list
 * @param key
 */
export function groupArrayOfObjects(list, key) {
    return list.reduce((rv, x) => {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
}

export const isLastIndex = (array, index) => Boolean(index === array.length - 1)

export const isFirstIndex = (array, index) => Boolean(index === 0)