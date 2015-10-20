import React, { Component } from 'react'
import Helmet from 'react-helmet';

import Page404 from './pages/404'
import Spinner from './ui/Spinner'
import Breadcrumbs from './ui/Breadcrumbs'
import EditProduct from './edit/Product'
import Modal from './ui/Modal'

import { Link } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as actionCreators from '../actions/catalog'
import * as design from '../actions/design';

@connect(state => ({ products: state.catalog.products, collections: state.catalog.collections, categories: state.catalog.categories, isEditor: state.login.isEditor }), dispatch => ({actions: bindActionCreators(actionCreators, dispatch), design: bindActionCreators(design, dispatch)}))
class Products extends Component {
    static defaultProps = { source: 'categories' }
    state = { edit: false }
    componentWillMount() {
        const { getCollections, getCategories, getProducts } = this.props.actions
        let { products, source } = this.props
        if (this.props[source].length === 0) {
            if (source === 'collections') getCollections()
            else getCategories()
        }
        else this.getCurrent();
        
        if (products.length === 0) getProducts()
    }
    componentDidMount() {
        $(document).ready(() => {
            this.activateAnimation()
        })
        this.activateAnimation()
    }
    componentDidUpdate(prevProps) {
        this.activateAnimation()
        if (prevProps[this.props.source].length === 0) this.getCurrent();
    }
    getCurrent() {
        let { code, source } = this.props;
        let { setLine } = this.props.design;
        const current = this.props[source].filter(el => (el.code === code))[0]
        setLine(current.line);
        this.setState({current: current})
    }
    editProduct(code, e) {
        e.preventDefault()
        let { products } = this.props
        const item = products.filter(el => (code === el.code))[0];
        this.setState({edit: item});
        this.refs.modal.show()
    }
    activateAnimation() {
        setTimeout(() => {
            $('.products').removeClass('products--ready').addClass('products--ready')
        }, 500)
    }
    getItems(current) {
        let { products, source, isEditor } = this.props
        let delay = 0
        const items = products
            .filter(el => (el[source] === current._id))
            .map((el, i) => {
                const { name, artnumber, preview, code } = el
                if (i > 0) delay += 0.1
                return <div key={i}
                            className='products__item'
                            style={{transition: `.3s all ${delay}s`}}>

                        {isEditor ? <a href='#' className='edit' data-id={code} onClick={this.editProduct.bind(this, code)}><img src='/layout/images/svg/pencil.svg' width='17' /></a> : false}

                        <Link to={`/catalog/product/${code}/`} className='products__link'>
                            <div className='products__image'>
                                <img src={preview} alt={name} />
                            </div>
                            <div className={`products__name`}>{name}</div>
                            <div className='products__artnumber'>{artnumber}</div>
                        </Link>
                    </div>
            })
        return items
    }

    render() {
        let { products, routes, isEditor } = this.props
        if (this.state.current && products.length > 0) {
            const current = this.state.current;
            if (current) {
                return <div className='products'>
                        <Helmet title={'Russell Hobbs | ' + current.name}/>
                        <Breadcrumbs routes={routes} current={current} />
                        <div className='text'>
                            <h2>{current.name}</h2>
                            <div dangerouslySetInnerHTML={{__html: current.description}} />
                        </div>
                        <img src='/layout/images/line.png' width='100%' className='products__line' />
                        <div className='products__items'>{this.getItems(current)}</div>
                        {isEditor ?
                            <Modal ref='modal' className='modal--wide' static={true}>
                                <div className='modal__content'><EditProduct value={this.state.edit}/></div>
                            </Modal>
                            : false }
                    </div>
            }
            return <Page404 hideTitle={true}/>
        }

        return <Spinner />
    }
}

export default Products
