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

@connect(state => ({ checks: state.profile.checks }), dispatch => ({profile: bindActionCreators(profileActionCreators, dispatch)}), null, { withRef: true })
class AddCheckModal extends Component {
    state = { disabled: false }
    show(fields) {
        if (fields) this.setState({fields: fields})
        this.refs.modal.show()
    }
    hide(e) {
        this.refs.modal.hide()
        this.refs.form.reset()
        if (e) e.preventDefault()
    }
    state = {message: false, disabled: false}
    submitForm(fields) {
        this.setState({
            disabled: true,
            message: false,
            error: false
        })
        let formData = new FormData()
        let file = this.refs.file.getFiles()
        formData.append('photo', file)
        for (let el in fields) {
            if (el !== 'photo') {
                formData.append(el, fields[el])
            }
        }
        $.ajax(
            {
                type: 'POST',
                url: '/profile/checks/add/',
                processData: false,
                cache: false,
                contentType: false,
                data: formData
            })
            .done(data => {
                if (data.status === 'success') {
                    this.props.profile.getChecks()
                    this.refs.form.reset()
                    this.hide()
                }
                if (data.error) {
                    this.setState({
                        disabled: false,
                        error: data.error.message
                    })
                }
                this.setState({
                    disabled: false
                })
            })
    }
    render() {
        return <Modal ref='modal' className='modal modal--add-check' onValidSubmit={this.submitForm.bind(this)}>
            <h3 className='modal__title modal__title--border'>Добавление чека</h3>
            <Formsy.Form ref='form' onValidSubmit={this.submitForm.bind(this)} className='form'>
                {this.state.message ? <div className='alert' role='alert'>{this.state.message}</div> : null}
                {this.state.error ? <div className='alert alert--error' role='alert'>{this.state.error}</div> : null}
                <div className='form__title'>Информация об организации</div>
                <Input name='organisation' title='Наименование' value=''/>
                <Input name='inn' title='ИНН*' validations='minLengthOrEmpty:1' value=''/>
                <div className='form__title'>Реквизиты чека</div>
                <Input name='eklz' title='Рег. номер ЭКЛЗ*' validations='minLengthOrEmpty:1' value=''/>
                <div className='form__date'>
                    <label>Дата*</label>
                    <Input name='date__day' placeholder='ДД' maxLength='2' validations='minLengthOrEmpty:2' value=''/>
                    <Input name='date__month' placeholder='MM' maxLength='2' validations='minLengthOrEmpty:2' value=''/>
                    <Input name='date__year' placeholder='ГГ' maxLength='2' validations='minLengthOrEmpty:2' value=''/>
                    <label>Время*</label>
                    <Input name='time__hours' placeholder='ЧЧ' maxLength='2' validations='minLengthOrEmpty:2' value=''/>
                    <Input name='time__minutes' placeholder='MM' maxLength='2' validations='minLengthOrEmpty:2' value=''/>
                </div>
                <div className='form__total'>
                    <label>Сумма*</label>
                    <Input name='total__rubles' validations='minLengthOrEmpty:1' value=''/>
                    <label>руб.</label>
                    <Input name='total__cents' value=''/>
                    <label>коп.</label>
                </div>
                <div className='form__kpk'>
                    <label htmlFor=''>Номер КПК*</label>
                    <Input name='kpk_number' title='' validations='minLengthOrEmpty:1' value=''/>
                    <label htmlFor=''>Значение&nbsp;КПК*</label>
                    <Input name='kpk_value' validations='minLengthOrEmpty:1' value=''/>
                </div>


                <div className='form__title'>Фото чека</div>
                <div className='form__file-description right'>
                    На чеке должны быть отчетливо видны реквизиты и позиции товаров
                </div>
                <File name='photo' ref='file' title='Загрузить фото' validations='minLengthOrEmpty:1' value=''/>
                <div className='modal__footer'>
                    <div className='form__submit-description right'>
                        * - поля, обязательныедля заполнения
                    </div>

                    <button type='submit' disabled={this.state.disabled}>
                        {this.state.disabled ? <img src='/layout/images/loading.gif' /> : null}
                        Отправить чек на проверку
                    </button>
                    <a href='#' className='form__cancel' onClick={this.hide.bind(this)}><span>Отменить</span></a>
                </div>


            </Formsy.Form>
        </Modal>
    }
}

export default AddCheckModal
