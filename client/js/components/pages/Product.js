import React, { Component } from 'react'
import Helmet from 'react-helmet'
import { Link } from 'react-router'

import Page404 from '../pages/404'
import Spinner from '../ui/Spinner'
import Breadcrumbs from '../ui/Breadcrumbs'
import Title from '../layout/Title'
import CheckAssignModal from '../profile/blocks/CheckAssignModal'

import * as actionCreators from '../../actions/catalog'
import * as design from '../../actions/design'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import 'react-photoswipe/lib/photoswipe.css'
import {PhotoSwipe} from 'react-photoswipe'
import * as profileActionCreators from '../../actions/profile'

@connect(
    state => ({ products: state.catalog.products, isLogin: state.login.isLogin, favorites: state.profile.favorites }),
    dispatch => ({
        actions: bindActionCreators(actionCreators, dispatch),
        design: bindActionCreators(design, dispatch),
        profile: bindActionCreators(profileActionCreators, dispatch)
    })
)
class Product extends Component {
    state = { open: 'short', photoswipe: false, index: 0 }
    componentWillMount() {
        const { getProducts } = this.props.actions
        if (this.props.products.length === 0) getProducts()
        else this.getCurrent()
    }
    getCurrent() {
        let {products, routeParams} = this.props
        let { setLine } = this.props.design
        let current = products.filter(el => (el.code === routeParams.code))[0]
        if (current) setLine(current.line)
        this.setState({current: current})
    }
    handleClick(e) {
        let href = e.target.href
        this.setState({open: href.split('#')[1] })
        e.preventDefault()
        e.stopPropagation()
    }
    componentDidUpdate(prevProps) {
        let {products, profile, favorites, isLogin} = this.props
        if (prevProps.products.length === 0 && products.length > 0) this.getCurrent()
        if (isLogin && !favorites) {
            profile.getFavorites()
        }
    }
    openPhotoSwipe(i) {
        return (e) => {
            e.preventDefault()
            this.setState({photoswipe: true, index: i})
            $('body').addClass('photoswipe-open')
        }
    }
    closePhotoSwipe() {
        $('body').removeClass('photoswipe-open')
        this.setState({photoswipe: false})

    }
    openAssignModal(name, id) {
        return (e) => {
            e.preventDefault()
            this.refs.modal.getWrappedInstance().show(name, id)
        }
    }
    render() {
        let { routes, favorites } = this.props
        if (this.state.current) {
            const current = this.state.current
            if (current) {
                const {isLogin, favorites} = this.props
                const { _id,
                        name,
                        artnumber,
                        preview,
                        images,
                        video,
                        pdf,
                        features,
                        description} = current

                return <div className='page page--product'>
                    <Helmet title={'Russell Hobbs | ' + name}/>
                    <Title />
                    <Breadcrumbs routes={routes} current={current} />
                    <PhotoSwipe isOpen={this.state.photoswipe} options={{shareEl: false, index: this.state.index}} items={images.map(el => ({src: el, w: 369, h: 362}))} onClose={this.closePhotoSwipe.bind(this)}/>
                    <div className='product'>
                        <h2 className='product__name'>{name}</h2>
                        <h4 className='product__artnumber'>{artnumber}</h4>
                        <div className='product__images'>
                            <div className='product__image'>
                                <img src={preview} alt=''/>
                            </div>
                            <div className='product__thumbs'>
                                {images.map((el, i) => {
                                    return <a href='#' onClick={this.openPhotoSwipe(i)} className='product__thumb' key={i} style={{backgroundImage: `url(${el})`}}>
                                        <div className='product__thumb-preview' style={{backgroundImage: `url(${el})`}}></div>
                                    </a>
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
                                ref='short'
                                >
                                { isLogin ?
                                    <div className='product__favorite'>
                                        <a href='#' onClick={this.openAssignModal(name + ' ' + artnumber, _id)}>
                                        {typeof favorites === 'object' && favorites.indexOf(_id) === -1
                                            ? <span><img src='/layout/images/svg/heart-border-red.svg' alt='' width='22'/>В избранное</span>
                                        : <span><img src='/layout/images/svg/heart.svg' alt='' width='22'/> Привязать к еще одному чеку</span>
                                        }
                                        </a>
                                    </div>
                                    : null}
                                <span dangerouslySetInnerHTML={{__html: description }} />
                                { video ? <div className='product__video'><iframe width='440' height='248' src={video} frameBorder='0' allowFullScreen=''></iframe></div> : false}
                                { pdf ? <div className='product__pdf'><a href={pdf} target='_blank'><img src='/layout/images/svg/pdf.svg' />Скачать инструкции</a></div> : false}

                                { false !== true ? null : <div className='product__sale'>
                                    <h4>Купить со скидкой:</h4>
                                    <a target="_blank" style={{backgroundImage: 'url(/layout/images/ozon.jpg)'}} href='http://www.ozon.ru/?context=search&text=russell+hobbs' className='product__sale-link'></a>
                                    <a target="_blank" style={{backgroundImage: 'url(/layout/images/u.jpg)'}} href='http://www.ulmart.ru/search?string=russell+hobbs&rootCategory=&sort=6' className='product__sale-link'></a>
                                    <h4>Промокод: RUSSELLHOBBS</h4>
                                </div> }
                            </div>
                            <div
                                className={`product__tabs-content ${this.state.open === 'full' ? 'product__tabs-content--active' : null}`}
                                ref='full'
                                >
                                {features.list.length > 0 ?
                                    <ul className='product__features'>
                                        {features.list.map((el, i) => {
                                            return <li key={i} dangerouslySetInnerHTML={{__html: el }} />
                                        })}
                                    </ul>
                                    : false }
                                {features.icons.length > 0 ?
                                    <div className='product__icons'>
                                        {features.icons.map((el, i) => {
                                            return <img key={i} src={el.image} alt={el.title}/>
                                        })}
                                    </div>
                                    : false}
                            </div>
                        </div>
                    </div>
                    <CheckAssignModal ref='modal'/>
                </div>
            }
            return <Page404 />
        }
        return <Spinner />
    }
}

export default Product
