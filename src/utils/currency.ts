/**
 * Unnamed
 * @param num
 */
export function addZeroes(num) {
    let numberAsString = num.toString();
    if ((numberAsString.indexOf('.') === -1) || (numberAsString.split(".")[1].length < 3)) {
        num = num.toFixed(2);
        numberAsString = num.toString();
    }
    return numberAsString
}