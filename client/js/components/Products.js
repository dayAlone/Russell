import React, { Component } from 'react'
import Helmet from 'react-helmet'

import IconSVG from 'svg-inline-loader/lib/component.jsx'

import Page404 from './pages/404'
import Spinner from './ui/Spinner'
import Breadcrumbs from './ui/Breadcrumbs'
import CheckAssignModal from './profile/blocks/CheckAssignModal'

import { Link } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as catalogActionCreators from '../actions/catalog'
import * as designActionCreators from '../actions/design'
import * as profileActionCreators from '../actions/profile'

@connect(
    state => ({
        products: state.catalog.products,
        collections: state.catalog.collections,
        categories: state.catalog.categories,
        isLogin: state.login.isLogin,
        favorites: state.profile.favorites
    }), dispatch => ({
        actions: bindActionCreators(catalogActionCreators, dispatch),
        design: bindActionCreators(designActionCreators, dispatch),
        profile: bindActionCreators(profileActionCreators, dispatch),
    }))
class Products extends Component {
    static defaultProps = { source: 'categories' }
    state = { edit: false }
    componentWillMount() {
        const { getProducts } = this.props.actions
        let { products, source } = this.props
        if (this.props[source].length > 0) {
            this.getCurrent()
        }

        if (products.length === 0) getProducts()
    }
    componentDidMount() {
        $(document).ready(() => {
            this.activateAnimation()
        })
        this.activateAnimation()
    }
    componentWillUpdate(nextProps) {
        if (nextProps.code !== this.props.code) this.setState({current: false})
    }
    componentDidUpdate(prevProps) {
        this.activateAnimation()
        let {source, isLogin, profile, favorites} = this.props
        if (isLogin && !favorites) {
            profile.getFavorites()
        }

        if (prevProps[source].length === 0 && this.props[source].length > 0 && !this.state.current) this.getCurrent()

    }
    getCurrent() {
        let { code, source } = this.props
        let { setLine } = this.props.design
        const current = this.props[source].filter(el => (el.code === code))[0]
        if (current) setLine(current.line)
        this.setState({current: current})
    }
    activateAnimation() {
        setTimeout(() => {
            $('.products').removeClass('products--ready').addClass('products--ready')
        }, 500)
    }
    openAssignModal(name, id) {
        return (e) => {
            e.preventDefault()
            this.refs.modal.getWrappedInstance().show(name, id)
        }
    }
    getItems(current) {
        let { products, source, isLogin, favorites } = this.props

        let delay = 0
        const items = products
            .filter(el => (el[source] === current._id))
            .map((el, i) => {
                const { name, artnumber, preview, code, _id } = el
                if (i > 0) delay += 0.1
                return <div key={i}
                            className='products__item'
                            style={{transition: `.3s all ${delay}s`}}>

                        <Link to={`/catalog/product/${code}/`} className='products__link'>
                            <div className='products__image'>
                                <img src={preview} alt={name} />
                            </div>
                            <div className={`products__name`}>{name}</div>
                            <div className='products__artnumber'>{artnumber}</div>
                        </Link>
                        { isLogin ?
                            <div className={`products__favorite ${typeof favorites === 'object' && favorites.indexOf(_id) === -1 ? '' : 'products__favorite--active'}`}>
                                <a href='#' onClick={this.openAssignModal(name + ' ' + artnumber, _id)}>
                                    <IconSVG src={require('svg-inline!../../public/images/svg/heart-border.svg')}/>

                                </a>
                            </div>
                            : null}
                    </div>
            })
        return items
    }

    render() {
        let { products, routes, isLogin } = this.props
        if (this.state.current && products.length > 0) {
            const current = this.state.current
            if (current) {
                return <div className='products'>
                        <Helmet title={'Russell Hobbs | ' + current.name}/>
                        <Breadcrumbs routes={routes} current={current} />
                        <div className='text'>
                            <h2>{current.name}</h2>
                            <div dangerouslySetInnerHTML={{__html: current.description}} />
                        </div>
                        <img src='/layout/images/line.png' width='100%' className='products__line' />
                        <div className={`products__items ${isLogin ? 'products__items--favorites' : ''}`}>{this.getItems(current)}</div>
                        <CheckAssignModal ref='modal'/>
                    </div>
            }
            return <Page404 hideTitle={true}/>
        }

        return <Spinner />
    }
}

export default Products
