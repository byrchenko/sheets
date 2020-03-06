import React from "react";
import PropTypes from "prop-types"
import css from "./index.module.scss";

class SuppliersPopup extends React.Component {

    /**
     *
     * @param props
     */
    constructor(props) {
        super(props);

        this.state = {
            filter: null
        }
    }

    /**
     *
     */
    setFilter() {
        return ({target: {value}}) => {
            this.setState({
                filter: value
            })
        }
    }

    /**
     *
     * @param item
     * @returns {*}
     */
    renderItem(item) {
        return (
            <li
                className={css.item}
                key={item.id}
                onClick={() => {
                    this.props.addSupplier(item.name);
                    this.props.closePopup();
                }}
            >
                {item.name}
            </li>
        )
    }

    /**
     *
     */
    renderList() {
        const {list} = this.props;
        const {filter} = this.state;

        const filteredList = list.filter(item => {
            return item.name
                .toLowerCase()
                .includes(filter ? filter.toLowerCase() : null)
        });

        if (!filteredList.length) {
            return (
                <div className={css.empty}>Nothing found</div>
            )
        }


        return (
            <ul className={css.list}>
                {filteredList.slice(0, 50).map(this.renderItem, this)}
            </ul>
        )
    }

    /**
     *
     */
    render() {
        const {filter} = this.state;

        return (
            <div className={css.index}>
                <h3 className={css.title}>Add supplier</h3>

                <input
                    className={css.input}
                    type="search"
                    placeholder="Start typing suppliers name.."
                    value={filter ? filter : ""}
                    onChange={this.setFilter()}
                />

                {this.renderList()}

                <div
                    className={css.close}
                    onClick={this.props.closePopup}
                >&times;</div>
            </div>
        )
    }
}

/**
 *
 */
SuppliersPopup.propTypes = {
    list: PropTypes.array
};

export default SuppliersPopup;