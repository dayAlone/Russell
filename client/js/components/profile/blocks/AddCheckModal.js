import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'

import Formsy from 'formsy-react'
import {Input} from '../../forms/'

import Modal from '../../ui/Modal'
import * as profileActionCreators from '../../../actions/profile'

Formsy.addValidationRule('minLengthOrEmpty', (values, value) => {
    return value && value.length >= length
})

@connect(state => ({ checks: state.profile.checks }), dispatch => ({profile: bindActionCreators(profileActionCreators, dispatch)}), null, { withRef: true })
class AddCheckModal extends Component {
    state = { disabled: false }
    show() {
        this.refs.modal.show()
    }
    hide(e) {
        this.refs.modal.hide()
        if (e) e.preventDefault()
    }
    submitForm(fields) {
        this.refs.modal.hide()
    }
    render() {
        return <Modal ref='modal' className='modal modal--add-check'>
            <h3 className='modal__title modal__title--border'>Добавление чека</h3>
            <Formsy.Form ref='form' onValidSubmit={this.submitForm.bind(this)} className='form'>
                <Input name='organisation' title='Наименование' validations='minLengthOrEmpty:1' value=''/>
                <Input name='inn' title='ИНН*' validations='minLengthOrEmpty:1' value=''/>
                <Input name='eklz' title='Рег. номер ЭКЛЗ*' validations='minLengthOrEmpty:1' value=''/>
                    date
                    time
                    total
                    kpk_number
                    kpk_value
                    photo

            </Formsy.Form>
        </Modal>
    }
}

export default AddCheckModal
