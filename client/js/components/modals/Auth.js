import React, { Component } from 'react'
import Modal from '../ui/Modal'
import LoginSocial from '../LoginSocial'
import LoginEmail from '../LoginEmail'
import IconSVG from 'svg-inline-loader/lib/component.jsx'
import Formsy from 'formsy-react'
import {Input, File} from './../forms/'

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
        let {isLogin, modal} = this.props
        if (!this.refs.modal.hasHidden()) {
            if (
                (isLogin === true && modal !== 'forget-form-success' && modal !== 'forget-form' && modal !== 'confirm')
                || (modal === false && prevProps.modal !== false && modal !== 'confirm')) {
                    this.refs.modal.hide()
                }    
        }

        if (modal !== false && this.refs.modal.hasHidden()) this.refs.modal.show()
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
                <a href='#' onClick={this.showBlock('forget-link')}>Забыли пароль?</a><br/>
                <a href='#' onClick={this.showBlock('registration')}>Регистрация по электронной почте</a>
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
            let formData = new FormData()
            let file = this.refs.file.getFiles()
            if (file) formData.append('photo', file)
            formData.append('captcha', captcha)
            for (let el in fields) {
                if (el !== 'photo' && fields[el]) {
                    formData.append(el, fields[el])
                }
            }
            $.ajax(
                {
                    type: 'POST',
                    url: '/auth/local/signup',
                    processData: false,
                    cache: false,
                    contentType: false,
                    data: formData
                }
            )
            .done(response => {
                let fields = {
                    error: false,
                    disabled: false
                }
                if (response.error) {
                    this.refs.captha.reset()
                    fields.error = response.error.message
                } else {
                    const { openModal } = this.props.actions
                    openModal('registration-success')
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
    sendNewPasswordForm(fields) {
        this.setState({
            error: false,
            disabled: true
        })
        fields = Object.assign({}, fields, {
            passwordResetToken: this.props.routes.query.change_password
        })
        $.post('/auth/local/new-password/', fields)
        .done(response => {
            let fields = {
                error: false,
                disabled: false
            }
            if (response.error) {
                fields.error = response.error.message
            } else {
                const { openModal } = this.props.actions
                openModal('forget-form-success')
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
    sendNewPasswordLink(fields) {
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
            $.post('/auth/local/new-password-email/', fields)
            .done(response => {
                let fields = {
                    error: false,
                    disabled: false
                }
                if (response.error) {
                    this.refs.captha.reset()
                    fields.error = response.error.message
                } else {
                    const { openModal } = this.props.actions
                    openModal('forget-link-success')
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
    }
    onCaptchaChange(value) {
        this.setState({
            error: false,
            captcha: value
        })
    }
    getRegistration() {
        return <div className='modal__content'>
            <h2 className='modal__title'>Регистрация <nobr>по эл. почте</nobr></h2>
            <Formsy.Form ref='form' onValidSubmit={this.sendRegister.bind(this)} className='form'>
                {this.state.error ? <div className='alert alert-danger' role='alert'>{this.state.error}</div> : false}
                <Input name='displayName' title='Имя и фамилия *' placeholder='Иван Сидоров' validations='minLengthOrEmpty:1'/>
                <Input name='email' type='email' title='Эл. почта *' placeholder='ivan@sydorov.ru' validations='minLengthOrEmpty:1,isEmail'/>
                <Input name='phone' title='Телефон' placeholder='+7 903 123-45-67' validations='minLength:1'/>
                <Input type='password' name='password' title='Пароль' validations='minLengthOrEmpty:6'/>
                <Input type='password' name='password_confirm' title='Повтор пароля' validations='minLengthOrEmpty:6,equalsField:password'/>
                <File name='photo' ref='file' title='Загрузить фото' value='' accept='image/jpeg,image/png,image/gif'/>
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
    getRegistrationSuccess() {
        return <div>
            <h2 className='modal__title modal__title--padding'>Регистрация <nobr>по эл. почте</nobr></h2>
            <div className='modal__message'>
                Почти готово! Осталось только подтвердить ваш электронный адрес. Пожалуйста, проверьте вашу почту.
            </div>
        </div>
    }
    getRegistrationConfirm() {
        return <div>
            <h2 className='modal__title modal__title--padding'>Подтверждение адреса</h2>
            <div className='modal__message'>
                Ваш электронный адрес подтвержден. <br/>{!this.props.isLogin ? 'Теперь вы можете авторизоваться на сайте.' : '' }
            </div>
            {!this.props.isLogin ? <a href='#' onClick={this.showBlock()} className='button button--small'>Войти на сайт</a> : null}
        </div>
    }
    getForgetPasswordFormSuccess() {
        return <div>
            <h2 className='modal__title modal__title--padding'>Изменение пароля</h2>
            <div className='modal__message'>
                Ваш пароль изменен. {!this.props.isLogin ? 'Теперь вы можете авторизоваться на сайте.' : null}
            </div>
            {!this.props.isLogin ? <a href='#' onClick={this.showBlock()} className='button button--small'>Войти на сайт</a> : null}
        </div>
    }
    getNewPasswordLinkSuccess() {
        return <div>
            <h2 className='modal__title modal__title--padding'>Восстановление пароля</h2>
            <div className='modal__message'>
                На указанный электронный адрес отправлено письмо с инструкцией по восстановлению пароля.
            </div>
        </div>
    }
    getForgetPasswordLink() {
        return <div className='modal__content'>
            <h2 className='modal__title'>Восстановление пароля</h2>
            <Formsy.Form ref='form' onValidSubmit={this.sendNewPasswordLink.bind(this)} className='form form--forget-link'>
                {this.state.error ? <div className='alert alert-danger' role='alert'>{this.state.error}</div> : false}
                <Input name='email' title='Введите e-mail, указанный при регистрации *' placeholder='ivan@sydorov.ru' validations='minLengthOrEmpty:1,isEmail'/>

                <Recaptcha className='captcha'
                    ref='captha'
                    sitekey='6Le-9BATAAAAAHSGueTMzAjoTDxlWMIxsKeVjuGO'
                    onChange={this.onCaptchaChange.bind(this)}/>
                <button className='button' type='submit' disabled={this.state.disabled}>
                    {this.state.disabled ? <img src='/layout/images/loading.gif' /> : null}
                    Восстановить пароль
                </button>

            </Formsy.Form>
        </div>
    }
    getForgetPasswordForm() {
        return <div className='modal__content'>
            <h2 className='modal__title'>Изменение пароля</h2>
            <Formsy.Form ref='form' onValidSubmit={this.sendNewPasswordForm.bind(this)} className='form form--forget'>
                {this.state.error ? <div className='alert alert-danger' role='alert'>{this.state.error}</div> : false}
                <Input type='password' name='password' title='Пароль' validations='minLengthOrEmpty:6'/>
                <Input type='password' name='password_confirm' title='Повтор пароля' validations='minLengthOrEmpty:6,equalsField:password'/>
                <button className='button' type='submit' disabled={this.state.disabled}>
                    {this.state.disabled ? <img src='/layout/images/loading.gif' /> : null}
                    Сохранить пароль
                </button>

            </Formsy.Form>
        </div>
    }
    getContent() {
        switch (this.props.modal) {
        case 'registration-success':
            return this.getRegistrationSuccess()
        case 'registration':
            return this.getRegistration()
        case 'confirm':
            return this.getRegistrationConfirm()
        case 'forget-link':
            return this.getForgetPasswordLink()
        case 'forget-link-success':
            return this.getNewPasswordLinkSuccess()
        case 'forget-form':
            return this.getForgetPasswordForm()
        case 'forget-form-success':
            return this.getForgetPasswordFormSuccess()
        default:
            return this.getForms()
        }
    }
    showBlock(name) {
        return (e) => {
            const { openModal } = this.props.actions
            openModal(name)
            this.refs.modal.checkOwerflow()
            e.preventDefault()
        }
    }
    render() {

        return <Modal ref='modal' className='modal modal--auth center' onHide={this.hideModal.bind(this)}>
            <a href='#' className='modal__close' onClick={this.hideModal.bind(this)}><IconSVG src={require('svg-inline!../../../public/images/svg/close.svg')}/></a>
            {this.getContent()}
            </Modal>
    }
}

export default AuthModal

/*
    { this.state.showEmail ? <LoginEmail /> : <a href='#' onClick={this.showEmail.bind(this)} className='trigger'>Вход по логину и паролю</a>}<br/>
*/
