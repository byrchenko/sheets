import React from 'react';
import css from "./App.module.scss";
import ReactDataSheet from 'react-datasheet';
import 'react-datasheet/lib/react-datasheet.css';
import columns from "./_mock/columns";
import groups from "./_mock/colGroups";
import rows from "./_mock/rows";
import supplierColumns from "./_mock/supplierColumns";
import moment from "moment";

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
                                    label: item.code
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
                    label: columns[i].dataKey,
                    value: id,
                    readOnly: true
                })
            } else {
                row.push({
                    label: columns[i].dataKey,
                    className: css.cell,
                    value: item ? item[columns[i].dataKey] : ""
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
                const {grid} = prevState;

                return {
                    grid: [
                        ...grid,
                        this.createEmptyRow(grid.length - 1)
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
                    onCellsChanged={changes => {
                        const {groups, columns, rows} = this.state;

                        const grid = [
                            groups,
                            columns,
                            ...rows
                        ];

                        changes.forEach(({cell, row, col, value}) => {
                            grid[row][col] = {...grid[row][col], value}
                        });

                        this.setState({grid})
                    }}
                />

                <button onClick={this.addRow()}>
                    Add row
                </button>

                <button onClick={this.addSupplier("Ayacom")}>
                    Add supplier
                </button>
            </>
        )
    }
}

export default App;
