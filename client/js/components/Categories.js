import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'

import Carousel from './ui/Carousel'
import Spinner from './ui/Spinner'
import Breadcrumbs from './ui/Breadcrumbs'

@connect(state => ({ collections: state.catalog.collections, categories: state.catalog.categories }))
class Categories extends Component {
    static defaultProps = { source: 'categories' }
    activateAnimation() {
        setTimeout(() => {
            $('.categories').removeClass('categories--ready').addClass('categories--ready')
        }, 500)
    }
    componentDidMount() {
        $(document).ready(() => {
            this.activateAnimation()
        })
        this.activateAnimation()
    }
    componentDidUpdate() {
        this.activateAnimation()
    }
    render() {
        let { children, source, type, routes } = this.props
        let css
        if (this.props[source].length > 0) {
            let delay = 0
            let categories = this.props[source].map((el, i) => {
                const { code, image, name, short_description } = el
                if (!type) {
                    if (i > 0) delay += 0.1
                    css = {
                        transition: `.3s all ${delay}s`
                    }
                }
                return <Link className='categories__item' key={i} to={`/catalog/${source}/${code}/`} style={css}>
                    <div className='categories__frame'>
                        <div className='categories__image' style={{backgroundImage: `url(${image})`}}/>
                        <div className='categories__name'>{name}</div>
                        <div className='categories__description' dangerouslySetInnerHTML={{__html: short_description}} />
                    </div>
                </Link>
            })
            if (type === 'carousel') {
                return <div className='categories'>
                    {children}
                    <Carousel responsive={true} className='categories__slider' slideToShow='4'>{categories}</Carousel>
                    <div className='categories__action center'>
                        { source === 'collections' ? <Link to={`/catalog/collections/`} className='button'>Все коллекции</Link> : false }
                    </div>
                </div>
            }
            return <div className='categories categories--list' ref='block'>
                    <Breadcrumbs routes={routes} />
                    {children}
                    <img src='/layout/images/line.png' width='100%' className='categories__line' />
                    <div className='categories__rows'>{categories}</div>
                </div>
        }
        return <Spinner />
    }
}

export default Categories
