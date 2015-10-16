import React, { Component } from 'react';

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
                        code,
                        images} = current;
                return <div className='page'>
                    <Title />
                    <Breadcrumbs routes={routes} current={current} />
                    <div className="product">
                        <h2 className="product__name">{name}</h2>
                        <h4 className="product__artnumber">{artnumber}</h4>
                        <div className="product__images">
                            <img src={preview} alt="" className="product__image"/>
                            {images.map((el, i) => {
                                return <div className="product__thumb" style={{backgroundImage: `url(${el})`}}>
                                    <div className="product__thumb-preview" style={{backgroundImage: `url(${el})`}}></div>
                                </div>
                            })}
                        </div>
                    </div>
                </div>;
            }
            return <Page404 />;
        }
        return <Spinner />;
    }
}

export default Product;
