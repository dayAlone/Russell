import React, { Component } from 'react'
import Helmet from 'react-helmet'

import Page404 from '../pages/404'
import Spinner from '../ui/Spinner'
import Breadcrumbs from '../ui/Breadcrumbs'
import Title from '../layout/Title'
import ShareLove from '../ShareLove'

import * as actionCreators from '../../actions/catalog'
import * as design from '../../actions/design'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

@connect(state => ({ products: state.catalog.products }), dispatch => ({actions: bindActionCreators(actionCreators, dispatch), design: bindActionCreators(design, dispatch)}))
class Product extends Component {
    state = { open: 'short' }
    componentWillMount() {
        const { getProducts } = this.props.actions
        if (this.props.products.length === 0) getProducts()
        else this.getCurrent()
    }
    getCurrent() {
        let {products, routeParams} = this.props
        let { setLine } = this.props.design
        let current = products.filter(el => (el.code === routeParams.code))[0]
        setLine(current.line)
        this.setState({current: current})
    }
    handleClick(e) {
        let href = e.target.href
        this.setState({open: href.split('#')[1] })
        e.preventDefault()
        e.stopPropagation()
    }
    componentDidUpdate(prevProps) {
        console.log(1)
        if (prevProps.products.length === 0) this.getCurrent()
    }
    render() {
        let { routes } = this.props
        if (this.state.current) {
            const current = this.state.current
            if (current) {
                const { name,
                        artnumber,
                        preview,
                        images,
                        video,
                        pdf,
                        features,
                        line,
                        description} = current

                return <div className='page page--product'>
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
                                    </div>
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
                                <span dangerouslySetInnerHTML={{__html: description }} />
                                { video ? <div className='product__video'><iframe width='440' height='248' src={video} frameBorder='0' allowFullScreen=''></iframe></div> : false}
                                { pdf ? <div className='product__pdf'><a href={pdf} target='_blank'><img src='/layout/images/svg/pdf.svg' />Скачать инструкции</a></div> : false}
                            </div>
                            <div
                                className={`product__tabs-content ${this.state.open === 'full' ? 'product__tabs-content--active' : null}`}
                                ref='full'
                                >
                                {features.list.length > 0 ?
                                    <ul className='product__features'>
                                        {features.list.map((el, i) => {
                                            return <li key={i}>{el}</li>
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
                    <ShareLove />
                </div>
            }
            return <Page404 />
        }
        return <Spinner />
    }
}

export default Product
