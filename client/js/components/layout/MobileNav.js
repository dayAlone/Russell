import React, { Component } from 'react'
import { Link } from 'react-router'

import { connect } from 'react-redux'
import * as actionCreators from '../../actions/login'
import { bindActionCreators } from 'redux'

@connect(state => ({ isLogin: state.login.isLogin }), dispatch => ({actions: bindActionCreators(actionCreators, dispatch)}))
class Nav extends Component {
    openModal(e) {
        const { openModal } = this.props.actions
        this.props.closeNav()
        openModal()
        e.preventDefault()
    }
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
            {!this.props.isLogin ?
                <div className='nav__auth'>
                    <a onClick={this.openModal.bind(this)} href='#'>Регистрация</a> <span>/</span> <a onClick={this.openModal.bind(this)} href='#'>Авторизация</a></div>
                : <div className='nav__auth'>
                    <Link to='/profile/'>Личный кабинет</Link> <span>/</span> <a href='/auth/logout/'>Выход</a>
                </div> }

        </div>
    }
}
export default Nav
