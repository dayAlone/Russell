import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as actionCreators from '../actions/catalog';
import { bindActionCreators } from 'redux';

import Page404 from './pages/404';
import Spinner from './ui/Spinner';
import Breadcrumbs from './ui/Breadcrumbs';

@connect(state => ({ products: state.catalog.products, collections: state.catalog.collections, categories: state.catalog.categories }), dispatch => ({actions: bindActionCreators(actionCreators, dispatch)}))
class Products extends Component {
    static defaultProps = { source: 'categories' }
    componentWillMount() {
        const { getCollections, getCategories, getProducts } = this.props.actions;
        let { products, source } = this.props;
        if (this.props[source].length === 0) {
            if (source === 'collections') getCollections();
            else getCategories();
        }
        if (products.length === 0) getProducts();
    }
    activateAnimation() {
        setTimeout(() => {
            $('.products').removeClass('products--ready').addClass('products--ready');
        }, 500);
    }
    componentDidMount() {
        $(document).ready(() => {
            this.activateAnimation();
        });
        this.activateAnimation();
    }
    render() {
        let { products, source, code, routes } = this.props;

        if (this.props[source].length && products.length > 0) {
            const current = this.props[source].filter(el => (el.code === code))[0];
            if (current) {
                let delay = 0;
                const items = products
                    .filter(el => (el[source] === current._id))
                    .map((el, i) => {
                        const { name,
                                artnumber,
                                preview,
                                code } = el;
                        if (i > 0) delay += 0.1;
                        return <div className='products__item' key={i} style={{transition: `.3s all ${delay}s`}}>
                                <Link to={`/catalog/product/${code}/`}>
                                    <div className='products__image'>
                                        <img src={preview} alt={name} />
                                    </div>
                                    <div className={`products__name`}>{name}</div>
                                    <div className='products__artnumber'>{artnumber}</div>
                                </Link>
                            </div>;
                    });
                return <div className='products'>

                        <Breadcrumbs routes={routes} current={current} />
                        <div className='text'>
                            <h2>{current.name}</h2>
                            <div dangerouslySetInnerHTML={{__html: current.description}} />
                        </div>
                        <img src='/layout/images/line.png' width='100%' className='products__line' />
                        <div className='products__items'>{items}</div>
                    </div>;
            }
            return <Page404 hideTitle={true}/>;
        }

        return <Spinner />;
    }
}

export default Products;
