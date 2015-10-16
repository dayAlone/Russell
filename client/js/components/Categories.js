import React, { Component } from 'react';
import Carousel from './Carousel';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as actionCreators from '../actions/catalog';
import { bindActionCreators } from 'redux';

@connect(state => ({ collections: state.catalog.collections, categories: state.catalog.categories }), dispatch => ({actions: bindActionCreators(actionCreators, dispatch)}))
class Categories extends Component {
    static defaultProps = { source: 'categories' }
    componentWillMount() {
        if (this.props[this.props.source].length === 0) {
            const { getCollections, getCategories } = this.props.actions;
            if (this.props.source === 'collections')
                getCollections();
            else
                getCategories();
        }
    }
    render() {
        let { children, source, type } = this.props;
        let categories = this.props[source].map((el, i) => {
            const { code, image, name, short_description } = el;
            return <Link className='categories__item' key={i} to={`/catalog/${source}/${code}/`}>
                    <div className="categories__frame">
                        <div className="categories__image" style={{backgroundImage: `url(${image.replace(':/', 's:/')})`}}/>
                        <div className="categories__name">{name}</div>
                        <div className="categories__description">{short_description}</div>
                    </div>
                </Link>;
        });
        if (type === 'carousel') {
            return <div className='categories'>
                {children}
                <Carousel className='categories__slider' slideToShow='4'>{categories}</Carousel>
                <div className="categories__action center">
                    { source === 'collections' ? <Link to={`/catalog/collections/`} className="button">Все коллекции</Link> : false }
                </div>
            </div>;
        } else {
            return <div className='categories'>
                {children}
                <img src="/layout/images/line.png" width="100%" className="categories__line" />
                <div className="categories__rows">{categories}</div>
           </div>;
       }
    }
}

export default Categories;
