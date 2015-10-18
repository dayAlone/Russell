import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actionCreators from '../actions/login';
import { bindActionCreators } from 'redux';

@connect(state => ({ routerState: state.router, user: state.login.data, isLogin: state.login.isLogin }), dispatch => ({actions: bindActionCreators(actionCreators, dispatch)}))
class UserInfo extends Component {
    componentWillMount() {
        const { authCheck } = this.props.actions;
        authCheck();
    }
    render() {
        if (this.props.isLogin) {
            let { realName: name, photo } = this.props.user;
            if (name) {
            name = name.split(' ');
            return <div className='header__profile header__col'>
                    <img src={photo} alt='' width='40'/>
                    <div className='header__name'>{name[0]}<br/>{name[1]}</div>
                </div>;
            }
        }
        return false;
        return <div className='header__links header__col right'>
                <a href='#'>Регистрация</a> <span>/</span> <a href='#'>Авторизация</a>
            </div>;
    }
}

export default UserInfo;
