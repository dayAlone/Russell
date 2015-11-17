import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Formsy from 'formsy-react'
import {Input, File} from '../../forms/'

import Modal from '../../ui/Modal'
import * as profileActionCreators from '../../../actions/profile'

Formsy.addValidationRule('minLengthOrEmpty', (values, value, length) => {
    return value && value.length >= length
})

@connect(state => ({ user: state.login.data }), dispatch => ({profile: bindActionCreators(profileActionCreators, dispatch)}), null, { withRef: true })
class EditProfileModal extends Component {
    state = {
        error: false,
        disabled: false
    }
    componentWillMount() {
    }
    show() {
        this.refs.modal.show()
    }
    hide(e) {
        this.refs.modal.hide()
        this.refs.form.reset()
        if (e) e.preventDefault()
    }
    submitForm() {

    }
    render() {
        let {displayName, email, phone, photo} = this.props.user
        return <Modal ref='modal' className='modal modal--profile-edit' onValidSubmit={this.submitForm.bind(this)}>
            <div className='modal__title'>
                <h3>Изменение данных</h3>
            </div>
            <Formsy.Form ref='form' onValidSubmit={this.submitForm.bind(this)} className='form'>
                {this.state.error ? <div className='alert alert--error' role='alert'>{this.state.error}</div> : null}
                <Input name='displayName' title='Имя и фамилия' validations='minLengthOrEmpty:1' value={displayName}/>
                <Input name='email' title='Эл. почта' validations='minLengthOrEmpty:1' value={email}/>
                <Input name='phone' title='Телефон' validations='minLengthOrEmpty:1' value={phone}/>
                <File name='photo' ref='file' title='Заменить фото' validations={photo.length === 0 ? 'minLengthOrEmpty:1' : false } value='' accept='image/jpeg,image/png,image/gif'/>
                <div className='modal__footer'>
                    <button type='submit' disabled={this.state.disabled}>
                        {this.state.disabled ? <img src='/layout/images/loading.gif' /> : null}
                        Сохранить изменения
                    </button>
                    <a href='#' className='form__cancel' onClick={this.hide.bind(this)}><span>Отменить</span></a>
                </div>
            </Formsy.Form>
        </Modal>
    }
}

export default EditProfileModal
