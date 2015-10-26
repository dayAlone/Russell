import React, { Component } from 'react'
import { Link } from 'react-router'
import * as actionCreators from '../../actions/catalog'

class Nav extends Component {
    render() {
        return <div className='nav'>
            <div className='nav__col'>
                <Link to='/history/' className='nav__item' activeClassName='nav__item--active'>История бренда</Link>
            </div>
            <div className='nav__col center' ref='sub_frame'>
                <Link to='/catalog/' ref='sub_item' className='nav__item nav__item--sub' activeClassName='nav__item--active'>Каталог продукции</Link>
            </div>
            <div className='nav__col center' ref='sub_frame'>
                <Link to='/catalog/collections/' ref='sub_item' className='nav__item nav__item--sub' activeClassName='nav__item--active'>Коллекции</Link>
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
