import React, { Component } from 'react'
import hoverintent from 'hoverintent'
import { Link } from 'react-router'
import * as actionCreators from '../../actions/catalog'

import { findDOMNode } from 'react-dom'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
@connect(state => ({ line: state.design.line, collections: state.catalog.collections, categories: state.catalog.categories }), dispatch => ({actions: bindActionCreators(actionCreators, dispatch)}))
class Nav extends Component {
    componentWillMount() {
        const { getCollections, getCategories } = this.props.actions
        if (this.props.collections.length === 0) getCollections()
        if (this.props.categories.length === 0) getCategories()
    }
    hideFrame() {
        let frame = findDOMNode(this.refs.sub_frame)
        $(frame).removeClass('nav__col--hover')
    }
    componentDidMount() {

        let item = findDOMNode(this.refs.sub_item)
        let frame = findDOMNode(this.refs.sub_frame)
        let nav = findDOMNode(this.refs.sub_nav)
        let timeOut = false
        let hideNav = () => {
            $(frame).removeClass('nav__col--hover')
            setTimeout(() => $(nav).hide(), 300)
        }
        hoverintent(item,
            () => {
                clearTimeout(timeOut)
                $(nav).show()
                setTimeout(() => $(frame).addClass('nav__col--hover'), 100)
            },
            () => { timeOut = setTimeout(hideNav, 400) }
        ).options({
            interval: 50
        })
        hoverintent(nav,
            () => clearTimeout(timeOut),
            () => { timeOut = setTimeout(hideNav, 200) }
        ).options({
            interval: 50
        })
    }
    render() {
        return <div className='nav'>
            <div className='nav__col'>
                <Link to='/history/' className='nav__item' activeClassName='nav__item--active'>История бренда</Link>
            </div>
            <div className='nav__col center' ref='sub_frame'>
                <Link to='/catalog/' ref='sub_item' className='nav__item nav__item--sub' activeClassName='nav__item--active'>Продукты</Link>
                <div className='nav__frame' ref='sub_nav'>
                    {[{name: 'Каталог продукции', type: 'categories'}, {name: 'Коллекции', type: 'collections'}].map((el, i) => {
                        return <div className='nav__category' key={i}>
                            <Link to={`/catalog/${el.type}/`} className='nav__title'><span>{el.name}</span></Link>
                            {this.props[el.type].map((item, key) => {
                                return <Link key={key} className='nav__item' to={`/catalog/${el.type}/${item.code}/`}><span>{item.name}</span></Link>
                            })}
                        </div>
                    })}

                </div>
            </div>
            <div className='nav__col center'>
                <Link to='/buy/' className='nav__item' activeClassName='nav__item--active'>Где купить</Link>
            </div>
            <div className='nav__col right'>
                <Link to='/games/' className='nav__item' activeClassName='nav__item--active'>Выиграй мечту!</Link>
            </div>
            <div className='nav__line' style={{backgroundImage: `url(${this.props.line ? this.props.line : '/layout/images/menu.jpg'})`}}></div>
        </div>
    }
}
export default Nav
