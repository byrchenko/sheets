/**
 * Creating options for POST request
 *
 * @param body
 * @returns {*}
 * @private
 */
export function createPostOptions(body) {
	if(!body) {
		console.warn('No data provided for POST request!')
	}

    return {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(body),
    };
}

/**
 * Creating options for PUT request
 *
 * @returns {*}
 * @private
 */
export function createPutOptions(data) {
    return {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify(data),
    };
}

/**
 * Creating options for DELETE request
 *
 * @returns {*}
 * @private
 */
export function createDeleteOptions() {
    return {
        method: "DELETE",
        credentials: "include",
    };
}

/**
 * Creating options for GET request
 *
 * @returns {*}
 * @private
 */
export function createGetOptions() {
    return {
        method: "GET",
        credentials: "include",
    };
}

/**
 * Creating body for request
 *
 * @param data
 * @returns {null|FormData}
 * @private
 */
export function createBody(data) {
    if (!Object.keys(data).length) {
        throw new Error("Data is empty!");
    }

    if (typeof data !== "object") {
        throw new Error("Wrong data type!");
    }

    if (!data) {
        return null;
    }

    const formData = new FormData();

    for (let key in data) {
        if (Array.isArray(data[key])) {
            formData.append(key, JSON.stringify(data[key]));
        } else {
            formData.append(key, data[key]);
        }
    }

    return formData;
}

/**
 * Creating url with query params for GET request
 *
 * @param baseUrl
 * @param params
 * @private
 */
export function createUrlWithQueryParams(baseUrl, params) {
    if (params === undefined) {
        return baseUrl;
    }

    if (typeof params !== "object") {
        throw new Error("Invalid params type!");
    }

    const url = new URL(baseUrl);

    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    return url.href;
}

/**
 * Sending POST request
 *
 * @param url
 * @param data
 * @returns {Promise<Response>}
 * @private
 */
export function sendPost(url, data) {
    const options = createPostOptions(data);

    console.log(options.body);

    return fetch(url, options);
}

/**
 * Sending PUT request
 *
 * @returns {Promise<Response>}
 * @private
 * @param url
 * @param data
 */
export function sendPut(url, data) {
    const options = createPutOptions(data);

    console.log(url)

    console.log(options)

    return fetch(url, options);
}

/**
 * Sending DELETE request
 *
 * @param url
 * @returns {Promise<Response>}
 * @private
 */
export function sendDelete(url) {
    const options = createDeleteOptions();

    return fetch(url, options);
}

/**
 * Sending GET request
 *
 * @param baseUrl
 * @param params
 * @returns {Promise<Response>}
 * @private
 */
export function sendGet(baseUrl, params = {}) {
    const url = createUrlWithQueryParams(baseUrl, params);

    const options = createGetOptions();

    return fetch(url, options);
}