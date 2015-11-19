import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import IconSVG from 'svg-inline-loader/lib/component.jsx'

import Formsy from 'formsy-react'
import {Input, File} from '../../forms/'

import Modal from '../../ui/Modal'
import * as profileActionCreators from '../../../actions/login'

Formsy.addValidationRule('minLengthOrEmpty', (values, value, length) => {
    return value && value.length >= length
})

@connect(state => ({ user: state.login.data }), dispatch => ({actions: bindActionCreators(profileActionCreators, dispatch)}), null, { withRef: true })
class EditProfileModal extends Component {
    state = {
        error: false,
        disabled: false,
        message: false
    }
    componentWillMount() {
    }
    show() {
        this.setState({
            message: false
        })
        this.refs.modal.show()
    }
    hide(e) {
        this.refs.modal.hide()
        this.refs.form.reset()
        if (e) e.preventDefault()
    }
    submitForm(fields) {
        const { authCheck } = this.props.actions

        this.setState({
            disabled: true,
            message: false,
            error: false
        })
        let formData = new FormData()
        let file = this.refs.file.getFiles()
        if (file) formData.append('photo', file)
        for (let el in fields) {
            if (el !== 'photo') {
                formData.append(el, fields[el])
            }
        }
        $.ajax(
            {
                type: 'POST',
                url: '/profile/change/',
                processData: false,
                cache: false,
                contentType: false,
                data: formData
            })
            .done(data => {
                let fields = {
                    disabled: false
                }
                if (data.status === 'success') {
                    if (!data.emailChanged) {
                        this.hide()
                    } else {
                        fields.message = true
                    }
                    setTimeout(authCheck, 2000)
                }
                if (data.error) {
                    fields.error = data.error.message
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
    render() {
        let {displayName, email, phone, photo} = this.props.user
        return <Modal ref='modal' className='modal modal--profile-edit' onValidSubmit={this.submitForm.bind(this)}>
            <a href='#' className='modal__close' onClick={this.hide.bind(this)}><IconSVG src={require('svg-inline!../../../../public/images/svg/close.svg')}/></a>
            {this.state.message ? <div className='center'>
                <div className='modal__title'>
                    <h3>Подтверждение эл. почты</h3>
                </div>
                <div className='modal__message'>
                    Для смены электронного адреса необходимо подтвердить ваши данные. На введенный вами e-mail было направлено письмо с инструкцией по подтверждению электронного адреса.
                </div>
            </div> : <div>
                <div className='modal__title'>
                    <h3>Изменение данных</h3>
                </div>
                <Formsy.Form ref='form' onValidSubmit={this.submitForm.bind(this)} className='form'>
                    {this.state.error ? <div className='alert alert--error' role='alert'>{this.state.error}</div> : null}
                    <Input name='displayName' title='Имя и фамилия' validations='minLengthOrEmpty:1' value={displayName}/>
                    <Input name='email' type='email' title='Эл. почта' validations='minLengthOrEmpty:1,isEmail' value={email}/>
                    <Input name='phone' title='Телефон' validations='minLength:1' value={phone}/>
                    {photo ? <div className='form__avatar' style={{backgroundImage: `url(${photo})`}}></div> : null}
                    <File name='photo' ref='file' title={photo ? 'Заменить фото' : 'Загрузить фото'} value='' accept='image/jpeg,image/png,image/gif'/>
                    <div className='modal__footer'>
                        <button type='submit' disabled={this.state.disabled}>
                            {this.state.disabled ? <img src='/layout/images/loading.gif' /> : null}
                            Сохранить изменения
                        </button>
                        <a href='#' className='form__cancel' onClick={this.hide.bind(this)}><span>Отменить</span></a>
                    </div>
                </Formsy.Form>
            </div>}
        </Modal>
    }
}

export default EditProfileModal
