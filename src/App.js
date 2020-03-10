import React from 'react';
import css from "./App.module.scss";
import 'react-datasheet/lib/react-datasheet.css';
import columns from "./_mock/columns";
import groups from "./_mock/colGroups";
import rows from "./_mock/rows";
import supplierColumns from "./_mock/supplierColumns";
import moment from "moment";
import CalculationsService from "./_service/CalculationsService";
import SuppliersPopup from "./SuppliersPopup";
import suppliers from "./_mock/suppliers";
import DetailTable from "./DetailTable";
import ControlButtons from "./ControlButtons";
import SelectCell from "./SelectCell";

/**
 *
 */
class App extends React.Component {
    constructor(props) {
        super(props);

        this.HEADER_WIDTH = 19;
        this.HEADER_GROUP_COUNT = 3;

        this.options = [
            {label: 'KZT', value: 2.35},
            {label: 'RUB', value: 3.05},
            {label: 'USD', value: 3.99},
            {label: 'EUR', value: 4.35},
        ];

        this.HEADER_HEIGHT = 2;

        this.state = {
            groups: this.createHeaderGroups(),
            columns: this.createHeaderColumns(),
            rows: this.createRows(),
            suppliersPopup: false,
            currency: {},
            activeSuppliers: []
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
                code: columns[i].code,
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
     * Get currency value for supplier
     *
     * @param supplier
     * @param rowIndex
     */
    currencyValue(supplier, rowIndex) {
        return supplier && supplier.values[rowIndex]
            ? supplier.values[rowIndex]
            : this.options[0]
    }

    /**
     * Set currency value for supplier
     */
    chooseCurrency(supplierName, rowIndex) {
        return opt => this.setState(prevState => {
            const {activeSuppliers} = prevState;

            activeSuppliers.forEach(sup => {
                if (sup.name === supplierName) {
                    sup.values[rowIndex] = opt
                }
            });

            return {
                activeSuppliers
            }
        })
    }

    /**
     *
     * @returns {function(...[*]=)}
     */
    addSupplier() {
        return (name) => {
            this.setState(prevState => {
                const {activeSuppliers} = prevState;

                /**
                 * If supplier is added do nothing
                 */
                if (activeSuppliers.findIndex(item => item.name === name) !== -1) {
                    return null
                }

                activeSuppliers.push({
                    name,
                    values: {}
                });

                return {
                    activeSuppliers,
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
                    rows: prevState.rows.map((item, index) => {
                        const {activeSuppliers} = prevState;

                        const currSupplier = activeSuppliers.find(sup => sup.name === name);

                        return [
                            ...item,
                            ...supplierColumns.map(item => {
                                if (item.code === "currencyId") {
                                    return {
                                        className: css.cell,
                                        label: item.code,
                                        supplier: name,
                                        component: (
                                            <SelectCell
                                                value={this.currencyValue(currSupplier, index)}
                                                onChange={this.chooseCurrency(name, index)}
                                                options={this.options}
                                            />
                                        )
                                    }
                                }

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
     * @param id
     * @param item
     * @param cls
     * @returns {[]}
     */
    createEmptyRow(id, item, cls) {
        const row = [];

        for (let i = 0; i < cls.length; i++) {

            /**
             * Creating id cell
             */
            if (i === 0) {
                row.push({
                    className: css.cell,
                    label: cls[i].code,
                    value: id,
                    readOnly: true
                })
            }

            /**
             *
             */
            else if (cls[i].code === "currencyId") {

            }

            /**
             * Creating read-only cells
             */
            else if (
                cls[i].code === "ownPrice"
                || cls[i].code === "retailPrice"
                || cls[i].code === "sellingSum"
                || cls[i].code === "profit"
                || cls[i].code === "rest"
                || cls[i].code === "storePrice"
                || cls[i].code === "supplierSum"
            ) {
                row.push({
                    label: cls[i].code,
                    className: css.cell,
                    value: item ? item[cls[i].code] : "",
                    readOnly: true
                });
            }

            /**
             * Creating suppliers currency cells
             */
            else if (cls[i].code === "currencyId") {
                row.push({
                    label: cls[i].code,
                    className: css.cell,
                    value: item ? item[cls[i].code] : "",
                    component: (
                        <select name="" id="">
                            <option value="">1</option>
                            <option value="">2</option>
                            <option value="">3</option>
                        </select>
                    )
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
                        this.createEmptyRow(
                            rows.length + 1,
                            null,
                            [...this.state.columns]
                        )
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

    /**
     * Do actions when cell is changed
     */
    onChange() {
        return changes => {
            const {rows} = this.state;

            changes.forEach(({cell, row, col, value}) => {
               const Calc = new CalculationsService(rows);

                this.setState({
                    rows: [...Calc.resolveRows(cell,row, col, value)]
                });
            });

        }
    }

    /**
     * Generating table grid
     */
    generateGrid() {
        const {groups, columns, rows} = this.state;

        return [
            groups,
            columns,
            ...rows
        ]
    }

    /**
     * Render cell value
     */
    renderValue() {
        return (cell, i) => {

            if (
                cell.label === "deliveryDate"
                && cell.value !== undefined
                && cell.value !== null
                && cell.value !== ""
            ) {
                return moment(cell.value * 1000).format("DD/MM/YYYY")
            }


            if (cell.label === "currencyId") {
                const {activeSuppliers} = this.state;

                const currSupplier = activeSuppliers.find(sup => {
                    return sup.name === cell.supplier
                });

                const value = currSupplier.values[i - this.HEADER_HEIGHT];

                if (value) {
                    return value.label
                }

                return this.options[0].label
            }

            return cell.value
        }
    }

    /**
     * Render table control buttons
     */
    renderControls() {
        const {suppliersPopup} = this.state;

        if (suppliersPopup) {
            return null
        }

        return (
            <ControlButtons
                addRow={this.addRow()}
                openSuppliersPopup={this.openSuppliersPopup()}
            />
        )
    }

    /**
     * Render popup for choosing supplier
     */
    renderSuppliersPopup() {
        const {suppliersPopup} = this.state;

        if (!suppliersPopup) {
            return null
        }

        return (
            <SuppliersPopup
                list={suppliers}
                addSupplier={this.addSupplier()}
                closePopup={this.closeSuppliersPopup()}
            />
        )
    }

    /**
     *
     */
    render() {
        return (
            <>
                <DetailTable
                    data={this.generateGrid()}
                    valueRenderer={this.renderValue()}
                    onCellsChanged={this.onChange()}
                />

                {this.renderControls()}

                {this.renderSuppliersPopup()}
            </>
        )
    }
}

export default App;
