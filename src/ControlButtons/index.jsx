import React from "react";
import PropTypes from "prop-types";
import css from "./index.module.scss";

/**
 * Control buttons component
 *
 * @param addRow
 * @param openSuppliersPopup
 * @returns {*}
 * @constructor
 */
const ControlButtons = ({addRow, openSuppliersPopup}) => {
    return (
        <>
            <button
                className={css.row}
                onClick={addRow}
            >
                Add row
            </button>


            <button
                className={css.supplier}
                onClick={openSuppliersPopup}
            >
                Add supplier
            </button>
        </>
    );
};

/**
 * Prop types
 */
ControlButtons.propTypes = {
    addRow: PropTypes.func,
    openSuppliersPopup: PropTypes.func,
};

export default ControlButtons;