import * as Api from "./ApiMethods"

/**
 *
 */
describe('Api Methods', () => {

    /**
     *
     */
    describe('GET', () => {

        /**
         *
         */
        it('should fetch tables', done => {
            Api.fetchTables()
                .then(response => response.json())
                .then(parsed => {
                    console.log(parsed)
                    expect(parsed.length).toEqual(6);
                    done();
                })
                .catch(err => {
                    console.warn(err);
                    done();
                })
        });

        /**
         *
         */
        it('should fetch table rows', done => {
            Api.fetchTableRows([1, 2])
                .then(response => response.json())
                .then(parsed => {
                    expect(parsed.length).toEqual(2);
                    done();
                })
                .catch(err => {
                    console.warn(err);
                    done();
                })
        });

        /**
         *
         */
        it('should fetch row orders', done => {
            Api.fetchRowOrders(11491)
                .then(response => response.json())
                .then(parsed => {
                    expect(parsed.length).toEqual(0);
                    done();
                })
                .catch(err => {
                    console.warn(err);
                    done();
                })
        });

        /**
         *
         */
        it('should fetch products', done => {
            Api.fetchProducts()
                .then(response => response.json())
                .then(parsed => {
                    expect(parsed.length).toEqual(3318);
                    done();
                })
                .catch(err => {
                    console.warn(err);
                    done();
                })
        });

        /**
         *
         */
        it('should fetch suppliers', done => {
            Api.fetchSuppliers()
                .then(response => response.json())
                .then(parsed => {
                    expect(parsed.length).toEqual(844);
                    done();
                })
                .catch(err => {
                    console.warn(err);
                    done();
                })
        });

        /**
         *
         */
        it('should fetch currencies', done => {
            Api.fetchCurrencies()
                .then(response => response.json())
                .then(parsed => {
                    expect(parsed.length).toEqual(4);
                    done();
                })
                .catch(err => {
                    console.warn(err);
                    done();
                })
        });
    });

    /**
     *
     */
    describe('POST', () => {

        /**
         *
         */
        it.only('should save table', done => {
            const table = {
                "toExport": true,
                "rows": [
                    {
                        "id": 0,
                        "productName": "Test name",
                        "vendorCode": "Test code",
                        "quantity": 1,
                        "productId": 666,
                        "rests": 20,
                        "ownPrice": 1000,
                        "costPrice": 1200,
                        "retailPrice": 1200,
                        "addExpenses": 400,
                        "managerComment": "Test manager comment",
                        "commentForCP": "Test comment for CP",
                        "deliveryDate": 0,
                        "quantityForSale": 50,
                        "margin": 20,
                        "sellingPrice": 1000,
                        "remove": true,
                        "orders": [
                            {
                                "id": 10,
                                "supplierId": 1,
                                "purchaseFromStore": true,
                                "quantity": 12,
                                "price": 1000,
                                "comment": "Supplier test comment",
                                "remove": true
                            }
                        ]
                    }]
            };

            Api.saveTable(11492, table)
                .then(response => response.json())
                .then(parsed => {
                    console.log(parsed);
                    done();
                })
                .catch(err => {
                    console.warn(err);
                    done();
                })
        });
    });
});