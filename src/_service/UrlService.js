export const API_URL = "https://portal.ayacom.kz/api";

/**
 * Creating url for specific route
 *
 * @param path {string} - route path
 * @returns {string}
 */
export function createApiUrl(path) {
    return API_URL + path;
}