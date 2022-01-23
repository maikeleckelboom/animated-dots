import {checkIfImageExists} from "./img";

const randomCountry = (countries: Array<string>): string => {
    const index = Math.floor(Math.random() * countries.length)
    return countries[index]
}

export async function addCountries(rows) {
    return new Promise(resolve => {

        const countries = [
            "Afghanistan", "Albania", "Algeria", "Andorra",
            "Angola", "Netherlands", "Argentina", "Armenia",
            "Australia", "Austria", "Azerbaijan", "Bahamas"
        ]

        rows.map(row => {
            const country = randomCountry(countries)
            const imagePath = `/assets/flags/${country.toLowerCase()}.svg`
            checkIfImageExists(imagePath, (exists) => exists
                ? Object.assign(row, {
                    country: country,
                    flag: imagePath
                })
                : Object.assign(row, {
                    country: country,
                }))
        })

        resolve(rows)
    })
}