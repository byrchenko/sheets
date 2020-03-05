import CalcService from "./CalculationsService";

/**
 *
 */
describe('Calculations Service', () => {

    /**
     *
     */
    it('should calc AMOUNT FOR SALE', () => {
        const table = [
            [
                {
                    label: "supplierQuantity",
                    value: 10
                },
                {
                    label: "supplierQuantity",
                    value: 15
                },
                {
                    label: "take",
                    value: 10
                }
            ]
        ];

        const Calc = new CalcService(table);

        const sample = Calc.calcSaleAmount(0);

        expect(sample).toEqual(35);
    });

    /**
     *
     */
    it('should calc SUPPLIER SUM', () => {
        const row = [
            {
                supplier: "ayacom",
                label: "convertedPrice",
                value: 1000
            },
            {
                supplier: "ayacom",
                label: "supplierQuantity",
                value: 10
            }
        ];


        const Calc = new CalcService({});

        const sample = Calc.calcSupplierSum(row, "ayacom");

        expect(sample).toEqual(10000)
    });

    /**
     *
     */
    it('should calc SUPPLIERS SUM', () => {
       const table = [
           [
               {
                   supplier: "ayacom",
                   label: "convertedPrice",
                   value: 100
               },
               {
                   supplier: "ayacom",
                   label: "supplierQuantity",
                   value: 10
               },
               {
                   supplier: "ayacom",
                   label: "supplierQuantity",
                   value: 10
               },
               {
                   supplier: "test",
                   label: "convertedPrice",
                   value: 500
               },
               {
                   supplier: "test",
                   label: "supplierQuantity",
                   value: 10
               },
               {
                   supplier: "test",
                   label: "supplierQuantity",
                   value: 10
               },
           ]
       ];

        const Calc = new CalcService(table);

        const sample = Calc.calcSuppliersSum(table[0]);

        expect(sample).toEqual(10000)
    });
});

