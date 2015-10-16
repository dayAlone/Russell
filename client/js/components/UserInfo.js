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
            const { realName: name, photo } = this.props.user;
            return <div>
                <img src={photo} alt='' /><br/>
                {name}<br/>
            <a href="/auth/logout">Exit</a>
            </div>;
        }
        else {
            return false;
            return <div>
                <a href='#'>Регистрация</a> <span>/</span> <a href='#'>Авторизация</a>
            </div>;
        }
    }
}

export default UserInfo;
