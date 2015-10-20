import React, { Component } from 'react';
import { Link } from 'react-router';

import { connect } from 'react-redux'
@connect(state => ({ routerState: state.router, line: state.design.line }))
class Header extends Component {
    render() {
        return <div className='nav'>
            <div className='nav__col'>
                <Link to='/history/' className='nav__item' activeClassName='nav__item--active'>История бренда</Link>
            </div>
            <div className='nav__col center'>
                <Link to='/catalog/' className='nav__item' activeClassName='nav__item--active'>Продукты</Link>
            </div>
            <div className='nav__col center'>
                <Link to='/buy/' className='nav__item' activeClassName='nav__item--active'>Где купить</Link>
            </div>
            <div className='nav__col right'>
                <Link to='/games/' className='nav__item' activeClassName='nav__item--active'>Выиграй мечту!</Link>
            </div>
            <div className='nav__line' style={{backgroundImage: `url(${this.props.line ? this.props.line : '/layout/images/menu.jpg'})`}}></div>
        </div>;
    }
}
export default Header;
