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

class App extends React.Component {
    constructor(props) {
        super(props);

        this.HEADER_WIDTH = 19;
        this.HEADER_GROUP_COUNT = 3;

        this.state = {
            groups: this.createHeaderGroups(),
            columns: this.createHeaderColumns(),
            rows: this.createRows()
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

    /**
     *
     * @param name
     */
    addSupplier(name) {
        return () => {
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
    createEmptyRow(id, item) {
        const row = [];

        for (let i = 0; i < columns.length; i++) {
            if (i === 0) {
                row.push({
                    className: css.cell,
                    label: columns[i].code,
                    value: id,
                    readOnly: true
                })
            } else {
                row.push({
                    label: columns[i].code,
                    className: css.cell,
                    value: item ? item[columns[i].code] : ""
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
                        this.createEmptyRow(rows.length + 1)
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
            return this.createEmptyRow(index + 1, el)
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
                grid[row][col] = {...grid[row][col], value};

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
                });
            });

            this.setState({
                rows: grid.slice(2)
            })
        }
    }

    render() {
        const {groups, columns, rows} = this.state;

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

                <button
                    className={css.row}
                    onClick={this.addRow()}
                >
                    Add row
                </button>

                <button
                    className={css.supplier}
                    onClick={this.addSupplier("Ayacom")}
                >
                    Add supplier
                </button>
            </>
        )
    }
}

export default App;
