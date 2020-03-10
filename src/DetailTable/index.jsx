import React from "react";
import PropTypes from "prop-types"
import ReactDataSheet from "react-datasheet";

/**
 * Detail table component
 */
const DetailTable = ({data, valueRenderer, onCellsChanged}) => {
    return (
        <ReactDataSheet
            data={data}
            valueRenderer={valueRenderer}
            onCellsChanged={onCellsChanged}
        />
    )
};

/**
 * Prop types
 */
DetailTable.propTypes = {
    data: PropTypes.array,
    valueRenderer: PropTypes.func,
    onCellsChanged: PropTypes.func,
};

export default DetailTable;