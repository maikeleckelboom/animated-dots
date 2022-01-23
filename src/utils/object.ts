/**
 * Removes mulitiple properties from an object.
 * @param object
 * @param keys
 * @returns
 */
export const removeProperties = (object, ...keys) => {
    return Object.entries(object).reduce((prev, [key, value]) =>
        ({...prev, ...(!keys.includes(key) && {[key]: value})}), {});
}

export const convertArrayToObject = (array, key) =>
    array.reduce((acc, curr) => {
        acc[curr[key]] = curr;
        return acc;
    }, {});


function existsDeep(destination, source) {
    for (let property in source) {
        if (destination.hasOwnProperty(property)) {
            if (!existsDeep(destination[property], source[property])) {
                return false;
            }
        } else {
            return false;
        }
    }
    return true;
}