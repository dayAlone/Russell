import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import * as actionCreators from '../actions/login'
import { bindActionCreators } from 'redux'

@connect(state => ({ user: state.login.data, isLogin: state.login.isLogin }), dispatch => ({actions: bindActionCreators(actionCreators, dispatch)}))
class UserInfo extends Component {
    componentWillMount() {
        const { authCheck } = this.props.actions
        authCheck()
    }
    openModal(e) {
        const { openModal } = this.props.actions
        openModal()
        e.preventDefault()
    }
    render() {
        if (this.props.isLogin) {
            let { displayName: name, photo } = this.props.user
            if (name) {
                name = name.split(' ')
                return <div className='header__profile header__col'>
                    <Link to='/profile/' className='header__name'>
                        <img src={photo ? photo : '/layout/images/svg/avatar.svg'} alt='' width='40'/> <span>{name[0]}<br/>{name[1]}</span>
                    </Link>
                </div>
            }
        }
        return <div className='header__links header__col right'>
                <a onClick={this.openModal.bind(this)} href='#'>Регистрация</a> <span>/</span> <a onClick={this.openModal.bind(this)} href='#'>Авторизация</a>
            </div>
    }
}

export default UserInfo
