import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actionCreators from '../actions/login'
import { bindActionCreators } from 'redux'


@connect(state => ({ routerState: state.router, login: state.login }), dispatch => ({actions: bindActionCreators(actionCreators, dispatch)}))
class Login extends Component {
    handleLoginAuth(e) {
        e.preventDefault()
        const { authLogin } = this.props.actions
        authLogin({ email: this.refs.login.value, password: this.refs.password.value })
    }
    handleSocialAuth(e) {
        e.preventDefault()
        const { authSocial } = this.props.actions
        authSocial(e.currentTarget.getAttribute('href'))
    }
    render() {
        const { error } = this.props.login
        let list = {
            fb: {
                link: '/auth/facebook/login',
                name: 'Фейсбук'
            },
            vk: {
                link: '/auth/vk/login',
                name: 'Вконтакте'
            },
        }
        let socials = []
        for (let el in list) {
            let {name, link} = list[el]
            socials.push(<a
                key={el}
                href={link}
                onClick={this.handleSocialAuth.bind(this)}
                className={`button button--${el}`}>
                <img src={`/layout/images/svg/${el}.svg`} alt='' />
                {name}
            </a>)
        }
        return <div>
            {error ? <div className='alert alert-danger' role='alert'>{error}</div> : false}
            {socials}
        </div>
    }
}

export default Login
