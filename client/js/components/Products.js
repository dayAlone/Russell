import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as actionCreators from '../actions/catalog';
import { bindActionCreators } from 'redux';
import Page404 from './Page404';
import Spinner from './Spinner';

@connect(state => ({ products: state.catalog.products, collections: state.catalog.collections, categories: state.catalog.categories }), dispatch => ({actions: bindActionCreators(actionCreators, dispatch)}))
class Products extends Component {
    static defaultProps = { source: 'categories' }
    componentWillMount() {
        const { getCollections, getCategories, getProducts } = this.props.actions;
        let { products, source } = this.props;
        if (this.props[source].length === 0) {
            if (source === 'collections')
                getCollections();
            else
                getCategories();
        }
        if (products.length === 0) getProducts();
    }
    render() {
        let { products, source, code } = this.props;
        if (this.props[source].length && products.length > 0) {
            const current = this.props[source].filter(el => (el.code === code))[0];
            if (current) {
                const items = products
                    .filter(el => (el[source] === current._id))
                    .map((el, i) => {
                        const { name,
                                artnumber,
                                preview,
                                code } = el;

                        return <div className='products__item' key={i}>
                                <Link to={`/catalog/product/${code}/`}>
                                    <div className="products__image">
                                        <img src={preview} alt={name} />
                                    </div>
                                    <div className="products__name">{name}</div>
                                    <div className="products__artnumber">{artnumber}</div>
                                </Link>
                            </div>;
                    });
                return <div className='products'>
                        <div className="text">
                            <h2>{current.name}</h2>
                            <div dangerouslySetInnerHTML={{__html: current.description}} />
                        </div>
                        <img src="/layout/images/line.png" width="100%" className="products__line" />
                        <div className="products__items">{items}</div>
                    </div>;
            }
            return <Page404 hideTitle={true}/>;

        }
        return <Spinner />;

    }
}

export default Products;
