import React from "react";
import PropTypes from "prop-types";
import css from "./index.module.scss";
import Select from "react-select";

/**
 * Cell with select component
 *
 * @param props
 * @returns {*}
 * @constructor
 */
const SelectCell = ({value, onChange, options}) => {
    return (
        <Select
            styles={{
                control: (provided) => ({
                    ...provided,
                    minHeight: 'auto',
                    border: 'none',
                    borderRadius: 0,
                    outline: 'none',
                    width: '100%'
                }),
                dropdownIndicator: (provided) => ({
                    ...provided,
                    padding: 0,
                }),
                input: (provided) => ({
                    ...provided,
                    paddingTop: 0,
                    paddingBottom: 0,
                    paddingLeft: 8,
                    paddingRight: 8,
                    marginTop: 0,
                    marginBottom: 0,
                    fontSize: 12,
                }),
                valueContainer: provided => ({
                    ...provided,
                    paddingTop: 1,
                    paddingBottom: 1,
                }),
                singleValue: provided => ({
                    ...provided,
                    fontSize: 12,
                }),
                option: provided => ({
                    ...provided,
                    fontSize: 12,
                }),
                noOptionsMessage: provided => ({
                    ...provided,
                    fontSize: 12
                }),
            }}
            className={css.select}
            autoFocus={true}
            menuIsOpen={true}
            value={value}
            onChange={onChange}
            options={options}
        />
    );
};

/**
 * Prop types
 */
SelectCell.propTypes = {
    value: PropTypes.object,
    options: PropTypes.array,
    onChange: PropTypes.func,
};

export default SelectCell;