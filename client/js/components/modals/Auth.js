import React, { Component } from 'react'
import Modal from '../ui/Modal'
import LoginSocial from '../LoginSocial'
import LoginEmail from '../LoginEmail'

import Formsy from 'formsy-react'
import {Input} from './../forms/'

import * as actionCreators from '../../actions/login'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Recaptcha from 'react-google-recaptcha'


Formsy.addValidationRule('minLengthOrEmpty', (values, value, length) => {
    return value && value.length >= length
})

@connect(state => ({ modal: state.login.modal, login: state.login, isLogin: state.login.isLogin }), dispatch => ({actions: bindActionCreators(actionCreators, dispatch)}))
class AuthModal extends Component {
    state = { captcha: false, disabled: false }
    componentDidUpdate(prevProps) {
        if (this.props.isLogin === true
            || (this.props.modal === false && prevProps.modal !== false)) this.refs.modal.hide()
        if (this.props.modal !== false && this.refs.modal.hasHidden()) this.refs.modal.show()
    }
    hideModal() {
        const { hideModal } = this.props.actions
        hideModal()
    }

    getForms() {
        const { error } = this.props.login
        return <div className='modal__content'>
            <h2 className='modal__title'>Вход на сайт</h2>
            {error ? <div className='alert alert-danger' role='alert'>{error}</div> : false}
            <h4>Через социальные сети</h4>
            <LoginSocial noErrors={true}/>
            <h4>По электронной почте</h4>
            <LoginEmail noErrors={true}/>
            <div className='modal__links'>
                <a href='#'>Забыли пароль?</a><br/>
                <a href='#' onClick={this.showRegister.bind(this)}>Регистрация по e-mail</a>
            </div>
            {this.getMessage()}
        </div>
    }
    getMessage() {
        return <small>Регистрируясь на данном сайте, я подтверждаю, что ознакомлен и согласен с <a target='_blank' href='/conditions/'>Условиями использования</a> сайта. Даю свое согласие на сбор, обработку (в том числе с применением автоматизированных средств), хранение, использование, распространение в целях проведения Акции собственных персональных данных.</small>
    }
    sendRegister(fields) {
        let {captcha} = this.state
        if (!captcha) {
            this.setState({
                error: 'Укажите, что вы не робот;)'
            })
        } else {
            this.setState({
                error: false,
                disabled: true
            })
            fields = Object.assign({}, fields, {
                captcha: captcha
            })
            $.post('/auth/local/signup', fields)
            .done(response => {
                console.log(response)
                let fields = {
                    error: false,
                    disabled: false
                }
                if (response.error) {
                    if (response.error.code === 11111) this.refs.captha.reset()
                    fields.error = response.error.message
                } else {

                }
                this.setState(fields)
            })
            .fail(() => {
                this.setState({
                    disabled: false,
                    error: 'Что-то пошло не так, повторите попытку через пару минут'
                })
            })

        }
        return true
    }
    onCaptchaChange(value) {
        this.setState({
            error: false,
            captcha: value
        })
    }
    getRegistration() {
        return <div className='modal__content'>
            <h2 className='modal__title'>Регистрация по e-mail</h2>
            <Formsy.Form ref='form' onValidSubmit={this.sendRegister.bind(this)} className='form'>
                {this.state.error ? <div className='alert alert-danger' role='alert'>{this.state.error}</div> : false}
                <Input name='displayName' title='Имя и фамилия *' placeholder='Иван Сидоров' validations='minLengthOrEmpty:1'
                    value='Тестовый тест'/>
                <Input name='email' title='Эл. почта *' placeholder='ivan@sydorov.ru' validations='minLengthOrEmpty:1,isEmail'
                    value='asd@asdasd.ru'/>
                <Input name='phone' title='Телефон' placeholder='+7 903 123-45-67' validations='minLength:1'/>
                <Input type='password' name='password' title='Пароль' validations='minLengthOrEmpty:6'
                    value='123456'/>
                <Input type='password' name='password_confirm' title='Повтор пароля' validations='minLengthOrEmpty:6,equalsField:password' value='123456'/>
                <Recaptcha className='captcha'
                    ref='captha'
                    sitekey='6Le-9BATAAAAAHSGueTMzAjoTDxlWMIxsKeVjuGO'
                    onChange={this.onCaptchaChange.bind(this)}/>
                <button className='button' type='submit' disabled={this.state.disabled}>
                    {this.state.disabled ? <img src='/layout/images/loading.gif' /> : null}
                    Зарегистрироваться
                </button>
                {this.getMessage()}

            </Formsy.Form>
        </div>
    }
    getContent() {
        switch (this.props.modal) {
        case 'registration':
            return this.getRegistration()
        default:
            return this.getForms()
        }
    }
    showRegister(e) {
        const { openModal } = this.props.actions
        openModal('registration')
        e.preventDefault()
    }
    render() {

        return <Modal ref='modal' className='modal modal--auth center' onHide={this.hideModal.bind(this)}>
            {this.getContent()}
            </Modal>
    }
}

export default AuthModal

/*
    { this.state.showEmail ? <LoginEmail /> : <a href='#' onClick={this.showEmail.bind(this)} className='trigger'>Вход по логину и паролю</a>}<br/>
*/
