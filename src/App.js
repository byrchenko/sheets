import React from 'react';
import css from "./App.module.scss";
import ReactDataSheet from 'react-datasheet';
import 'react-datasheet/lib/react-datasheet.css';
import columns from "./_mock/columns";
import groups from "./_mock/colGroups";
import rows from "./_mock/rows";
import supplierColumns from "./_mock/supplierColumns";
import moment from "moment";
import CalculationsService from "./_service/CalculationsService";
import SuppliersPopup from "./SuppliersPopup";
import suppliers from "./_mock/suppliers";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.HEADER_WIDTH = 19;
        this.HEADER_GROUP_COUNT = 3;

        this.state = {
            groups: this.createHeaderGroups(),
            columns: this.createHeaderColumns(),
            rows: this.createRows(),
            suppliersPopup: false
        };

        this.createEmptyRow = this.createEmptyRow.bind(this);
    }

    /**
     *
     */
    openSuppliersPopup() {
        return () => {
            this.setState({suppliersPopup: true})
        }
    }


    /**
     *
     */
    closeSuppliersPopup() {
        return () => {
            this.setState({suppliersPopup: false})
        }
    }

    /**
     *
     * @returns {[]}
     */
    createHeaderColumns() {
        const result = [];

        for (let i = 0; i < this.HEADER_WIDTH; i++) {
            result.push({
                className: css.headerCell,
                value: columns[i].label,
                readOnly: true
            })
        }

        return result;
    }

    /**
     *
     * @returns {[]}
     */
    createHeaderGroups() {
        const result = [];

        for (let i = 0; i < this.HEADER_GROUP_COUNT; i++) {
            result.push({
                className: css.headerCell,
                colSpan: groups[i].span,
                value: groups[i].label,
                readOnly: true
            })
        }

        return result;
    }

    addSupplier() {
        return (name) => {
            this.setState(prevState => {
                return {
                    columns: [
                        ...prevState.columns,
                        ...supplierColumns.map(item => {
                            return {
                                className: css.headerCell,
                                value: item.label,
                                readOnly: true
                            }
                        })
                    ],
                    groups: [
                        ...prevState.groups,
                        {
                            className: css.headerCell,
                            colSpan: 7,
                            value: `Поставщик ${name}`,
                            readOnly: true
                        }
                    ],
                    rows: prevState.rows.map(item => {
                        return [
                            ...item,
                            ...supplierColumns.map(item => {
                                return {
                                    className: css.cell,
                                    value: "",
                                    label: item.code,
                                    supplier: name
                                }
                            })
                        ]
                    })
                }
            })
        }
    }

    /**
     *
     */
    createEmptyRow(id, item, cls) {
        const row = [];

        for (let i = 0; i < cls.length; i++) {
            if (i === 0) {
                row.push({
                    className: css.cell,
                    label: cls[i].code,
                    value: id,
                    readOnly: true
                })
            } else if (
                cls[i].code === "ownPrice"
                || cls[i].code === "retailPrice"
                || cls[i].code === "sellingSum"
                || cls[i].code === "profit"
                || cls[i].code === "rest"
                || cls[i].code === "storePrice"
            ) {
                row.push({
                    label: cls[i].code,
                    className: css.cell,
                    value: item ? item[cls[i].code] : "",
                    readOnly: true
                });
            } else {
                row.push({
                    label: cls[i].code,
                    className: css.cell,
                    value: item ? item[cls[i].code] : ""
                });
            }
        }

        return row;
    }

    /**
     *
     */
    addRow() {
        return () => {
            this.setState(prevState => {
                const {rows} = prevState;

                return {
                    rows: [
                        ...rows,
                        this.createEmptyRow(rows.length + 1, null, [...this.state.columns])
                    ]
                }
            })
        }
    }

    /**
     *
     * @returns {*}
     */
    createRows() {
        return rows.map((el, index) => {
            return this.createEmptyRow(index + 1, el, columns)
        })
    }

    onChange() {
        return changes => {
            const {groups, columns, rows} = this.state;

            const grid = [
                groups,
                columns,
                ...rows
            ];

            /**
             * Apply changes
             */
            changes.forEach(({cell, row, col, value}) => {
                /**
                 * Input validation
                 */
                if (cell.label === "supplierQuantity") {
                    const price = grid[row].find(item => {
                        return item.label === "convertedPrice"
                    });

                    if (!price.value) {
                        return null;
                    }
                }

                /**
                 * Change cell value
                 */
                if (cell.label === "sellingPrice") {
                    grid[row][col] = {
                        ...grid[row][col],
                        value,
                        isManualySetted: true
                    };
                } else if (cell.label === "margin") {
                    grid[row].forEach(item => item.label === "sellingPrice" ?
                        item.isManualySetted = false
                        : null
                    );

                    grid[row][col] = {...grid[row][col], value};
                } else {
                    grid[row][col] = {...grid[row][col], value};
                }

                const Calc = new CalculationsService(grid);

                /**
                 * Recalculate values after changes
                 */
                grid[row].forEach(item => {
                    if (item.label === "quantityForSale") {
                        return item.value = Calc.calcSaleAmount(row)
                    }

                    if (item.label === "ownPrice") {
                        return item.value = Calc.calcPrimeCost(row)
                    }

                    if (item.label === "margin") {
                        return item.value = Calc.calcMargin(row)
                    }

                    if (item.label === "sellingSum") {
                        return item.value = Calc.calcSaleSum(row)
                    }

                    if (item.label === "sellingPrice") {
                        return item.value = Calc.calcSalePrice(row)
                    }

                    if (item.label === "profit") {
                        return item.value = Calc.calcProfit(row)
                    }
                });
            });

            this.setState({
                rows: grid.slice(2)
            })
        }
    }

    render() {
        const {groups, columns, rows, suppliersPopup} = this.state;

        return (
            <>
                <ReactDataSheet
                    data={[
                        groups,
                        columns,
                        ...rows
                    ]}
                    valueRenderer={(cell) => {
                        if (
                            cell.label === "deliveryDate"
                            && cell.value !== undefined
                            && cell.value !== null
                            && cell.value !== ""
                        ) {
                            return moment(cell.value * 1000).format("DD/MM/YYYY")
                        }

                        return cell.value
                    }}
                    onCellsChanged={this.onChange()}
                />

                {!suppliersPopup && (
                    <>
                        <button
                            className={css.row}
                            onClick={this.addRow()}
                        >
                            Add row
                        </button>


                        <button
                            className={css.supplier}
                            // onClick={this.addSupplier("Ayacom")}
                            onClick={this.openSuppliersPopup()}
                        >
                            Add supplier
                        </button>
                    </>
                )}

                {suppliersPopup && (
                    <SuppliersPopup
                        list={suppliers}
                        addSupplier={this.addSupplier()}
                        closePopup={this.closeSuppliersPopup()}
                    />
                )}
            </>
        )
    }
}

export default App;
