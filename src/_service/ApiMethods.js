import {createApiUrl} from "./UrlService";
import {sendGet, sendPost, sendPut,} from "./RequestFactory";

/**
 * Fetching tables list
 *
 * @returns {Promise<Response>}
 */
export function fetchTables() {
    return sendGet(
        createApiUrl("/comparative-tables"),
        {
            show_all: "y"
        }
    )
}

/**
 * Fetching table rows
 *
 * @param rowIds {Array} - rows ids
 * @returns {Promise<Response>}
 */
export function fetchTableRows(rowIds) {
    return sendGet(
        createApiUrl("/comparative-table-rows"),
        {
            id: rowIds.join(",")
        }
    )
}

/**
 * Fetching row orders
 *
 * @param rowId {number} - id of rhe row
 */
export function fetchRowOrders(rowId) {
    return sendGet(
        createApiUrl("/orders-to-suppliers"),
        {
            id: rowId
        }
    )
}

/**
 * Fetching all products
 *
 * @returns {Promise<Response>}
 */
export function fetchProducts() {
	return sendGet(createApiUrl("/products"));
}

/**
 * Fetching all suppliers
 *
 * @returns {Promise<Response>}
 */
export function fetchSuppliers() {
	return sendGet(createApiUrl("/suppliers"));
}

/**
 * Fetching all currencies
 *
 * @returns {Promise<Response>}
 */
export function fetchCurrencies() {
	return sendGet(createApiUrl("/currencies"));
}

/**
 * Save table
 *
 * @param id {number} - table id
 * @param data {Object} - table object
 * @returns {Promise<Response>}
 */
export function saveTable(id, data) {
    return sendPut(createApiUrl(`/comparative-tables/${id}`), data)
}