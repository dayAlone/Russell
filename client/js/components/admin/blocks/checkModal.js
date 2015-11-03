import React, { Component } from 'react'

import Formsy from 'formsy-react'
import {Input, Dropdown} from '../../forms/'

import Modal from '../../ui/Modal'

class CheckModal extends Component {

    state = {
        message: false,
        disabled: false,

    }
    show(fields) {
        if (fields) this.setState({fields: fields})
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
        if (this.state.fields) {
            let {_id, organisation, inn, eklz, date, time, total, kpk_number, kpk_value, photo} = this.state.fields
        }
        return <Modal ref='modal' className='modal modal-edit-check' onValidSubmit={this.submitForm.bind(this)}>

        </Modal>
    }
}

export default CheckModal
