import React, { Component } from 'react'
import Modal from '../ui/Modal'
import LoginSocial from '../LoginSocial'
import LoginEmail from '../LoginEmail'
import { Link } from 'react-router'

import * as actionCreators from '../../actions/login'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

@connect(state => ({ modal: state.login.modal, isLogin: state.login.isLogin }), dispatch => ({actions: bindActionCreators(actionCreators, dispatch)}))
class AuthModal extends Component {
    state = { showEmail: false }
    componentDidUpdate(prevProps) {
        if (this.props.isLogin === true
            || (this.props.modal === false && prevProps.modal === true)) this.refs.modal.hide()
        if (this.props.modal === true) this.refs.modal.show()
    }
    hideModal() {
        const { hideModal } = this.props.actions
        hideModal()
    }
    showEmail(e) {
        this.setState({showEmail: true})
        e.preventDefault()
    }
    render() {
        return <Modal ref='modal' className='modal modal--auth center' onHide={this.hideModal.bind(this)}>
                <div className='modal__content'>
                    <h2 className='modal__title'>Вход на сайт</h2>
                    <LoginSocial />
                    <small>Регистрируясь на данном сайте, я подтверждаю, что ознакомлен и согласен с <Link to='/conditions/'>Условиями использования</Link> сайта. Даю свое согласие на сбор, обработку (в том числе с применением автоматизированных средств), хранение, использование, распространение в целях проведения Акции собственных персональных данных.</small>
                </div>
            </Modal>
    }
}

export default AuthModal

/*
    { this.state.showEmail ? <LoginEmail /> : <a href='#' onClick={this.showEmail.bind(this)} className='trigger'>Вход по логину и паролю</a>}<br/>
*/
