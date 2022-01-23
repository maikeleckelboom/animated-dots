/**
 * Mocks an API-request
 * @returns {Promise<unknown>}
 */
export const fakeApiRequest = () => {
    return new Promise(resolve => setTimeout(() => resolve(true), 3000))
}

