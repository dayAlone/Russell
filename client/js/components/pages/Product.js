import React, { Component } from 'react';

import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import * as actionCreators from '../../actions/catalog';
import { bindActionCreators } from 'redux';

import Page404 from '../pages/404';
import Spinner from '../ui/Spinner';
import Breadcrumbs from '../ui/Breadcrumbs';
import Title from '../layout/Title';

@connect(state => ({ products: state.catalog.products }), dispatch => ({actions: bindActionCreators(actionCreators, dispatch)}))
class Product extends Component {
    state = { open: 'short' }
    componentWillMount() {
        const { getProducts } = this.props.actions;
        if (this.props.products.length === 0) getProducts();
    }
    handleClick(e) {
        let href = e.target.href;
        console.log(href);
        this.setState({open: href.split('#')[1] });
        e.preventDefault();
        e.stopPropagation();
    }
    render() {
        let { products, routeParams, routes } = this.props;
        if (products.length > 0) {
            const current = products.filter(el => (el.code === routeParams.code))[0];
            if (current) {
                const { name,
                        artnumber,
                        preview,
                        images,
                        short_description,
                        description} = current;
                return <div className='page'>
                    <Helmet title={'Russell Hobbs | ' + name}/>
                    <Title />
                    <Breadcrumbs routes={routes} current={current} />
                    <div className='product'>
                        <h2 className='product__name'>{name}</h2>
                        <h4 className='product__artnumber'>{artnumber}</h4>
                        <div className='product__images'>
                            <div className='product__image'>
                                <img src={preview} alt=''/>
                            </div>
                            <div className='product__thumbs'>
                                {images.map((el, i) => {
                                    return <div className='product__thumb' key={i} style={{backgroundImage: `url(${el})`}}>
                                        <div className='product__thumb-preview' style={{backgroundImage: `url(${el})`}}></div>
                                    </div>;
                                })}
                            </div>
                        </div>
                        <div className='product__tabs'>
                            <div className='product__tabs-trigger'>
                                <a onClick={this.handleClick.bind(this)} className={this.state.open === 'short' ? 'active' : null} href='#short'>
                                    <span>
                                        Краткое описание
                                        <img src='/layout/images/down.png' alt='' />
                                    </span>
                                </a>
                                <a onClick={this.handleClick.bind(this)} className={this.state.open === 'full' ? 'active' : null} href='#full'>
                                    <span>
                                        Полное описание
                                        <img src='/layout/images/down.png' alt='' />
                                    </span>
                                </a>
                            </div>
                            <div
                                className={`product__tabs-content ${this.state.open === 'short' ? 'product__tabs-content--active' : null}`}
                                dangerouslySetInnerHTML={{__html: short_description.replace('<p>&nbsp;</p>', '')}}
                                ref='short'
                                />
                            <div
                                className={`product__tabs-content ${this.state.open === 'full' ? 'product__tabs-content--active' : null}`}
                                dangerouslySetInnerHTML={{__html: description.replace('<p>&nbsp;</p>', '')}}
                                ref='full'
                                />
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
