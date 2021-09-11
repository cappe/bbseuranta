const BASE_URL = '';

const toSnakeCase = str => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

const urlWithParams = (url, params = {}) => {
    const args = Object.keys(params).reduce((acc, key) => (
        `${acc}&${toSnakeCase(key)}=${params[key]}`
    ), '');

    if (args.length <= 0) return url;

    return `${url}?${args}`;
}

class ApiError extends Error {
    /**
     * @param {string} message
     * @param {number} httpStatus
     * @param {Response} response
     */
    constructor(message, httpStatus, response) {
        super();

        /**
         * @type {string}
         * @readonly
         */

        this.message = message;

        /**
         * @type {number}
         * @readonly
         */
        this.httpStatus = httpStatus;

        /**
         * @type {Response}
         * @readonly
         */
        this.response = response;

        /**
         * @type {string}
         * @readonly
         */
        this.name = this.constructor.name;

        /**
         * @type {string}
         * @readonly
         */
        this.stack = ApiError.createStack(this);
    }

    /**
     * @return {string}
     */
    toString() {
        return this.prettyPrint();
    }

    /**
     * @return {string}
     */
    prettyPrint() {
        return `HTTP status: ${this.httpStatus}; Message: ${this.message}`;
    }

    /**
     * @param {ApiError} error
     * @return {string}
     * @private
     */
    static createStack(error) {
        return typeof Error.captureStackTrace === 'function'
            ? Error.captureStackTrace(error, error.constructor)
            : (new Error()).stack;
    }
}

const getHeaders = (args = {}) => {
    const defaults = {
        Accept: 'application/json',
    };

    return Object.assign(defaults, args);
};

const parseResponse = async (response) => {
    if (response.ok) {
        if (response.status === 204) return true; // No body so no need to parse

        try {
            return await response.clone().json();
        } catch (e) {
            /**
             * Handles empty body. We could also response.text()
             * but it's easier to check for boolean than empty
             * string.
             */
            return true;
        }
    }

    let error;

    try {
        error = await response.json();
    } catch (e) {
        /**
         * Handles empty body.
         */
        error = { msg: '' };
    }

    if (process.env.NODE_ENV === 'development') {
        console.error('Response:', response); // eslint-disable-line
        console.error('Error:', error); // eslint-disable-line
    }

    throw new ApiError(error.msg, response.status, response);
};

export default {
    get(url, params = {}) {
        const options = {
            method: 'GET',
            headers: getHeaders(),
        };

        let baseUrl;

        if (typeof url === 'string') {
            baseUrl = `${BASE_URL}/${url}`;
        } else if (typeof url === 'object') {
            baseUrl = `${process.env.VUE_APP_API_URL}/${url.url}`;
        }

        const fullUrl = urlWithParams(baseUrl, params);

        return fetch(fullUrl, options).then(parseResponse);
    },
    post(url, data) {
        const options = {
            method: 'POST',
            headers: getHeaders({
                'Content-Type': 'application/json',
            }),
            body: JSON.stringify(data),
        };

        return fetch(`${BASE_URL}/${url}`, options).then(parseResponse);
    },
    update(url, data = {}) {
        const options = {
            method: 'PATCH',
            headers: getHeaders({
                'Content-Type': 'application/json',
            }),
        };

        if (Object.keys(data).length > 0) {
            Object.assign(options, {
                body: JSON.stringify(data),
            });
        }

        return fetch(`${BASE_URL}/${url}`, options).then(parseResponse);
    },
    delete(url) {
        const options = {
            method: 'DELETE',
            headers: getHeaders({
                'Content-Type': 'application/json',
            }),
        };

        return fetch(`${BASE_URL}/${url}`, options).then(parseResponse);
    },
};
