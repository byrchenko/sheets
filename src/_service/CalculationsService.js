/**
 * Cells calculations service
 */
export default class CalculationsService {

    /**
     * @constructor
     * @param table
     */
    constructor(table) {
        this.table = table;
    }

    /**
     * Getting current row
     *
     * @param index {number} - Row index
     * @returns {Array}
     */
    getCurrentRow(index) {
        return [...this.table[index]];
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

        console.log(sumCellArray)

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

        console.log(suppliersSum);

        const allSuppliersSum = suppliersSum.reduce((acc, next) => acc + next, 0);

        const totalPrimeCost = stockSum + additionalExpenses + allSuppliersSum;

        console.log(stockSum);
        console.log(allSuppliersSum);
        console.log(additionalExpenses);

        if (!totalPrimeCost || !saleAmount) {
            return 0
        }

        return totalPrimeCost / saleAmount;
    }
}

