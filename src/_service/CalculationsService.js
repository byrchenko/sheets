/**
 * Cells calculations service
 */
export default class CalculationsService {

    /**
     * @constructor
     * @param rows
     */
    constructor(rows) {
        this.rows = rows;
        this.TABLE_HEADER_ROWS_COUNT = 2;
    }

    /**
     *
     * @param cell
     * @param rowIndex
     * @param colIndex
     * @param value
     * @returns {*}
     */
    resolveRows(cell, row, colIndex, value) {
        const rowIndex = row - this.TABLE_HEADER_ROWS_COUNT;

        this.applyChange(cell, rowIndex, colIndex, value);

        this.resolveSaleAmount(cell.label, rowIndex, value);

        this.resolvePrimeCost(cell.label, rowIndex, value);

        return this.rows;
    }

    /**
     *
     * @param cell
     * @param row
     * @param col
     * @param value
     */
    applyChange(cell, row, col, value) {
        this.rows[row] = this.rows[row].map((item, index) => {
            if (item.label === cell.label && index === col) {
                item.value = value;
            }

            return item;
        });
    }

    /**
     *
     * @param type
     * @param row
     * @param value
     * @returns {*}
     */
    resolveSaleAmount(type, row, value) {
        const dependencies = ["take", "supplierQuantity"];

        if (dependencies.includes(type)) {
            const saleAmount = this.calcSaleAmount(row);

            this.rows[row].forEach(item => {
                if (item.label === "quantityForSale") {
                    item.value = saleAmount;
                }

                return item;
            });

            return this.rows;
        }
    }

    /**
     *
     * @param type
     * @param row
     * @param value
     * @returns {*}
     */
    resolvePrimeCost(type, row, value) {
        const dependencies = ["addExpenses", "supplierSum", "take"];

        if (dependencies.includes(type)) {
            this.rows[row].forEach(item => {
                if (item.label === "ownPrice") {
                    item.value = this.calcPrimeCost(row);
                }

                return item;
            });

            return this.rows;
        }
    }

    /**
     * Getting current row
     *
     * @param index {number} - Row index
     * @returns {Array}
     */
    getCurrentRow(index) {
        return this.rows[index];
    }

    /**
     * Quantities to be taken from suppliers
     *
     * @param row {Array} - Destination row array
     * @returns {Array}
     */
    getSuppliersAmount(row) {
        const quantities = row.filter(item => {
            return item.label === "supplierQuantity"
        });

        return quantities.map(item => {
            return Number(item.value)
        })
    }

    /**
     * Quantity to be taken from stock
     *
     * @param row {Array} - Destination row array
     * @returns {number}
     */
    getStoreAmount(row) {
        const amount = row.find(item => {
            return item.label === "take"
        });

        if(!amount.value) {
            return 0;
        }

        return Number(amount.value);
    }

    /**
     * Additional expenses value
     *
     * @param row {Array} - Destination row array
     * @returns {number}
     */
    getAdditionalExpenses(row) {
        const expenses = row.find(item => {
            return item.label === "addExpenses"
        });

        return Number(expenses.value);
    }

    /**
     * Additional expenses value
     *
     * @param row {Array} - Destination row array
     * @returns {number}
     */
    getStockPrice(row) {
        const price = row.find(item => {
            return item.label === "storePrice"
        });

        return Number(price.value);
    }

    /**
     * Calculating supplier sum
     *
     * @param row {Array} - Destination row array
     * @param supplier {string}
     */
    calcSupplierSum(row, supplier) {
        const price = row.find(item => {
            return item.supplier === supplier
                && item.label === "convertedPrice"
        }).value;

        const purchaseAmount = row.find(item => {
            return item.supplier === supplier
                && item.label === "supplierQuantity"
        }).value;

        return price * purchaseAmount;
    };

    /**
     * Sum values from all suppliers
     *
     * @param row {Array} - Destination row array
     * @returns {Array}
     */
    calcSuppliersSum(row) {

        /**
         * Array of "Sum" cells for all suppliers
         */
        const sumCellArray = row.filter(item => {
            return item.label === "supplierSum"
        });

        return sumCellArray.map(item => {
            return this.calcSupplierSum(row, item.supplier)
        })
    }

    /**
     * Calculating amount for sale
     *
     * @param rowIndex {number}
     * @returns {number}
     */
    calcSaleAmount(rowIndex) {
        const row = this.getCurrentRow(rowIndex);

        const suppliersAmount = this.getSuppliersAmount(row);

        const stockAmount = this.getStoreAmount(row);

        return [
            ...suppliersAmount,
            stockAmount
        ].reduce((acc, next) => acc + next, 0)
    }

    /**
     * Calculating stock sum
     *
     * @param row {Array} - Destination row array
     * @returns {number}
     */
    calcStockSum(row) {
        const stockAmount = this.getStoreAmount(row);
        const stockPrice = this.getStockPrice(row);

        if (!stockAmount || !stockPrice) {
            return 0
        }

        return stockAmount * stockPrice
    }

    /**
     * Calculating prime cost
     *
     * @param rowIndex {number}
     * @returns {number}
     */
    calcPrimeCost(rowIndex) {
        const row = this.getCurrentRow(rowIndex);
        const suppliersSum = this.calcSuppliersSum(row);
        const additionalExpenses = this.getAdditionalExpenses(row);
        const saleAmount = this.calcSaleAmount(rowIndex);
        const stockSum = this.calcStockSum(row);

        const allSuppliersSum = suppliersSum.reduce((acc, next) => acc + next, 0);

        const totalPrimeCost = stockSum + additionalExpenses + allSuppliersSum;

        if (!totalPrimeCost || !saleAmount) {
            return 0
        }

        return totalPrimeCost / saleAmount;
    }

    /**
     * Get sale price
     *
     * @param row {object}
     * @returns {number}
     */
    getSalePrice(row) {
        return +row.find(item => {
            return item.label === "sellingPrice"
        }).value;
    }

    /**
     * Calculating margin
     *
     * @param rowIndex {number}
     * @returns {number}
     */
    calcMargin(rowIndex) {
        const row = this.getCurrentRow(rowIndex);
        const salePrice = this.getSalePrice(row);
        const primeCost = this.calcPrimeCost(rowIndex);

        const isPriceSetted = row.find(item => item.label === "sellingPrice").isManualySetted;

        if (!isPriceSetted) {
            return +row.find(item => item.label === "margin").value;
        }

        if (!primeCost || !salePrice) {
            return 0
        }

        return (salePrice - primeCost) / primeCost * 100
    }

    /**
     * Calculating sale price
     *
     * @returns {number}
     * @param rowIndex
     */
    calcSalePrice(rowIndex) {
        const row = this.getCurrentRow(rowIndex);

        /**
         * Checks if price was set manually, and returns value if true
         */
        const price = row.find(item => {
            return item.label === "sellingPrice"
        });

        if (price.isManualySetted) {
            return +price.value;
        }

        /**
         * Calculate price from margin
         */
        const primeCost = +row.find(item => item.label === "ownPrice").value;
        const margin = +row.find(item => item.label === "margin").value;

        return primeCost + primeCost * margin / 100;
    }

    /**
     * Calculating sale sum
     *
     * @param rowIndex {number}
     * @returns {number}
     */
    calcSaleSum(rowIndex) {
        const salePrice = this.calcSalePrice(rowIndex);

        const saleAmount = this.calcSaleAmount(rowIndex);

        return salePrice * saleAmount;
    }

    /**
     * Calc profit
     *
     * @param rowIndex {number}
     * @returns {number}
     */
    calcProfit(rowIndex) {
        const saleAmount = this.calcSaleAmount(rowIndex);
        const primeCost = this.calcPrimeCost(rowIndex);
        const saleSum = this.calcSaleSum(rowIndex);

        return saleSum - primeCost * saleAmount;
    }
}

