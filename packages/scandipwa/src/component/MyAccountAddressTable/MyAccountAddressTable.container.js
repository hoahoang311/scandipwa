/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import {
    ADDRESS_POPUP_ID,
    DELETE_ADDRESS,
    EDIT_ADDRESS
} from 'Component/MyAccountAddressPopup/MyAccountAddressPopup.config';
import { showPopup } from 'Store/Popup/Popup.action';
import { Addresstype } from 'Type/Account.type';
import { MixType } from 'Type/Common.type';
import { CountriesType } from 'Type/Config.type';

import MyAccountAddressTable from './MyAccountAddressTable.component';

/** @namespace Component/MyAccountAddressTable/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    countries: state.ConfigReducer.countries
});

/** @namespace Component/MyAccountAddressTable/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    showEditPopup: (payload) => dispatch(showPopup(ADDRESS_POPUP_ID, payload))
});

/** @namespace Component/MyAccountAddressTable/Container */
export class MyAccountAddressTableContainer extends PureComponent {
    static propTypes = {
        mix: MixType,
        address: Addresstype.isRequired,
        showEditPopup: PropTypes.func.isRequired,
        countries: CountriesType.isRequired,
        showAdditionalFields: PropTypes.bool,
        showActions: PropTypes.bool,
        title: PropTypes.string
    };

    static defaultProps = {
        showAdditionalFields: false,
        showActions: false,
        mix: {},
        title: ''
    };

    containerFunctions = {
        getFormatedRegion: this.getFormatedRegion.bind(this),
        onEditClick: this.onEditClick.bind(this),
        onDeleteClick: this.onDeleteClick.bind(this)
    };

    containerProps() {
        const {
            address,
            countries,
            mix,
            showAdditionalFields,
            showActions,
            title
        } = this.props;

        return {
            address,
            countries,
            mix,
            showAdditionalFields,
            showActions,
            title
        };
    }

    onEditClick() {
        const { showEditPopup, address } = this.props;

        showEditPopup({
            action: EDIT_ADDRESS,
            title: __('Edit address'),
            address
        });
    }

    onDeleteClick() {
        const { showEditPopup, address } = this.props;

        showEditPopup({
            action: DELETE_ADDRESS,
            title: __('Confirm delete'),
            address
        });
    }

    getFormatedRegion(address) {
        const { countries } = this.props;
        const { country_id, region: regionData } = address;

        if (!regionData) {
            return {};
        }

        const { region_id, region } = regionData;
        const country = countries.find(({ id }) => id === country_id);

        if (!country) {
            return {};
        }

        const { label, available_regions } = country;
        const regions = available_regions || [];
        const { name } = regions.find(({ id }) => id === region_id) || { name: region };

        return {
            country: label,
            region: name
        };
    }

    render() {
        return (
            <MyAccountAddressTable
              { ...this.containerProps() }
              { ...this.containerFunctions }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountAddressTableContainer);
