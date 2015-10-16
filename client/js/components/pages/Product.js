import React, { Component } from 'react';
import { Link } from 'react-router';

import { connect } from 'react-redux';
import * as actionCreators from '../../actions/catalog';
import { bindActionCreators } from 'redux';

import Spinner from '../ui/Spinner';
import Breadcrumbs from '../ui/Breadcrumbs';

@connect(state => ({ products: state.catalog.collections }), dispatch => ({actions: bindActionCreators(actionCreators, dispatch)}))
class Product extends Component {
    static defaultProps = { source: 'categories' }
    componentWillMount() {

    }
    render() {
        return <Spinner />;
    }
}

export default Product;
