import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actionCreators from '../actions/login'
import { bindActionCreators } from 'redux'

@connect(state => ({ login: state.login }), dispatch => ({actions: bindActionCreators(actionCreators, dispatch)}))
class LoginEmail extends Component {
    handleLoginAuth(e) {
        e.preventDefault()
        const { authLogin } = this.props.actions
        authLogin({ email: this.refs.login.value, password: this.refs.password.value })
    }
    render() {
        const { error } = this.props.login
        return <form action='/auth/local/login' method='post' className='form form__login' name='login' id='login'>
                {error && !this.props.noErrors ? <div className='alert alert-danger' role='alert'>{error}</div> : false}
                <input type='email' id='email' ref='login' name='email' placeholder='Эл. почта' required='' autoFocus='' className='form-control' autofocus/>
                <input type='password' id='password' ref='password' name='password' required='' placeholder='Пароль' className='form-control' />
                <button onClick={this.handleLoginAuth.bind(this)} className='btn btn-md btn-su btn-block'>Войти</button>
            </form>
    }
}

export default LoginEmail
