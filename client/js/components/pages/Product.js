import React, { Component } from 'react';
import { Link } from 'react-router';

import { connect } from 'react-redux';
import * as actionCreators from '../../actions/catalog';
import { bindActionCreators } from 'redux';

import Page404 from '../pages/404';
import Spinner from '../ui/Spinner';
import Breadcrumbs from '../ui/Breadcrumbs';
import Title from '../layout/Title';

@connect(state => ({ products: state.catalog.products }), dispatch => ({actions: bindActionCreators(actionCreators, dispatch)}))
class Product extends Component {
    componentWillMount() {
        const { getProducts } = this.props.actions;
        if (this.props.products.length === 0) getProducts();
    }
    render() {
        let { products, routeParams, routes } = this.props;
        if (products.length > 0) {
            const current = products.filter(el => (el.code === routeParams.code))[0];
            if (current) {
                const { name,
                        artnumber,
                        preview,
                        code } = current;
                return <div className='page'>
                    <Title />
                    <Breadcrumbs routes={routes} current={current} />
                    <div className="product">
                        <h2 className="product__name">{name}</h2>
                        <h4 className="product__artnumber">{artnumber}</h4>
                    </div>
                </div>;
            }
            return <Page404 />;
        }
        return <Spinner />;
    }
}

export default Product;
