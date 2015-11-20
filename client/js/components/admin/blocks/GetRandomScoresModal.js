import React, { Component } from 'react'
import Modal from '../../ui/Modal'
class GetRandomScoresModal extends Component {
    state = {
        error: false,
        disabled: false,
        message: false
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
    render() {
        return <Modal ref='modal' className='modal modal--random-scores center'>

        </Modal>
    }
}

export default GetRandomScoresModal
