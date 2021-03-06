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

Formsy.addValidationRule('isNoMoreThan', (values, value, otherField) => {
    return Number(value) <= Number(otherField)
})

@connect(state => ({ checks: state.profile.checks }), dispatch => ({profile: bindActionCreators(profileActionCreators, dispatch)}), null, { withRef: true })
class AddCheckModal extends Component {

    emprtyFields = {
        _id: false,
        user: '',
        photo: '',
        photo2: '',
        organisation: '',
        inn: '',
        eklz: '',
        kpk_id: '',
        kpk_number: '',
        kpk_value: '',
        total: '',
        date: '',
        time: '',
        until: ''
    }
    state = {
        message: false,
        disabled: false,

    }
    componentWillMount() {
        this.setState({fields: this.emprtyFields})
    }
    show(fields) {
        if (fields) this.setState({fields: fields})
        else this.setState({fields: this.emprtyFields})
        this.refs.modal.show()
    }
    hide(e) {
        this.refs.modal.hide()
        this.refs.form.reset()
        if (e) e.preventDefault()
    }
    handleHelpClick(e) {
        this.props.openPhotoSwipe('/layout/images/check-sample.png', {w: 970, h: 785})
        e.preventDefault()
    }
    submitForm(fields) {
        let _this = this
        this.setState({
            disabled: true,
            message: false,
            error: false
        })
        let formData = new FormData()
        let file = this.refs.file.getFiles()
        let file2 = this.refs.file2.getFiles()
        formData.append('photo', file)
        formData.append('photo2', file2)
        for (let el in fields) {
            if (el !== 'photo' && el !== 'photo2') {
                formData.append(el, fields[el])
            }
        }

        $.ajax(
            {
                type: 'POST',
                url: fields.id ? '/profile/checks/update/' : '/profile/checks/add/',
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
            .fail(() => {
                _this.setState({
                    disabled: false,
                    error: 'Что-то пошло не так, повторите попытку через пару минут'
                })
            })
    }
    render() {
        let {_id, organisation, date, time, total, photo, photo2} = this.state.fields
        return <Modal ref='modal' className='modal modal--add-check' onValidSubmit={this.submitForm.bind(this)}>
            <div className='modal__title modal__title--border'>
                <h3>{ !_id ? 'Добавление чека' : 'Редактрирование чека' }</h3>
            </div>
            <Formsy.Form ref='form' onValidSubmit={this.submitForm.bind(this)} className='form'>
                {this.state.message ? <div className='alert' role='alert'>{this.state.message}</div> : null}
                {this.state.error ? <div className='alert alert--error' role='alert'>{this.state.error}</div> : null}
                { _id ? <Input name='id' type='hidden' value={_id}/> : null }
                <Input name='organisation' title=<span className='short'>Название<br/> организации</span> value={organisation}/>
                <div className='form__date'>
                    <label className='short'>Дата<br/ >покупки</label>
                    <Input name='date__day' placeholder='ДД' maxLength='2' validations='isNumeric,isNoMoreThan:31,minLengthOrEmpty:2' value={date.split('.')[0]}/>
                    <Input name='date__month' placeholder='MM' maxLength='2' validations='isNumeric,isNoMoreThan:12,minLengthOrEmpty:2' value={date.split('.')[1]}/>
                    <Input name='date__year' placeholder='ГГ' maxLength='2' validations='isNumeric,minLengthOrEmpty:2' value={date.split('.')[2]}/>
                    <label className='short'>Время<br/>покупки</label>
                    <Input name='time__hours' placeholder='ЧЧ' maxLength='2' validations='isNumeric,isNoMoreThan:23,minLengthOrEmpty:2' value={time.split(':')[0]}/>
                    <Input name='time__minutes' placeholder='MM' maxLength='2' validations='isNumeric,isNoMoreThan:59,minLengthOrEmpty:2' value={time.split(':')[1]}/>
                </div>
                <div className='form__total'>
                    <label>Сумма</label>
                    <Input name='total__rubles' validations='isNumeric,minLengthOrEmpty:1' value={total.split('.')[0]}/>
                    <label>руб.</label>
                    <Input name='total__cents' value={total.split('.')[1]}/>
                    <label>коп.</label>
                </div>
                <div className='form__file'>
                    <label>Фото чека</label>
                    <File name='photo' ref='file' title='Загрузить фото' validations={photo.length === 0 ? 'minLengthOrEmpty:1' : false } value='' accept='image/jpeg,image/png,image/gif'/>
                    <div className='form__file-description'>
                        На фото должны быть отчетливо видны реквизиты и позиции товаров в чеке
                    </div>
                </div>
                <div className='form__file'>
                    <label className='short'>Фото чека<br/ >с техникой</label>
                    <File name='photo2' ref='file2' title='Загрузить фото' validations={photo2.length === 0 ? 'minLengthOrEmpty:1' : false } value='' accept='image/jpeg,image/png,image/gif'/>
                    <div className='form__file-description'>
                        Сфотографируйте чек на фоне техники, которую вы приобрели
                    </div>
                </div>
                <div className='modal__footer'>
                    <div className='form__submit-description right'>
                        Все поля обязательныедля заполнения
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
