import React, { Component } from 'react'
import Formsy from 'formsy-react'
import {Input, Textarea, Dropdown} from '../../forms/'
import { connect } from 'react-redux'

Formsy.addValidationRule('minLengthOrEmpty', (values, value, length) => {
    return value && value.length >= length
})

@connect(state => ({ user: state.login.data }))
class FeedbackForm extends Component {
    state = {message: false, disabled: false}
    submitForm(fields) {
        let { displayName: name, email, _id } = this.props.user
        this.setState({
            disabled: true,
            message: false
        })
        $.post('/profile/feedback/send/',
            Object.assign({
                name: name,
                email: email,
                id: _id
            }, fields))
            .done(data => {
                if (data.status === 'sent') {
                    this.refs.form.reset()
                    this.setState({
                        disabled: false,
                        message: 'Сообщение успешно отправлено'
                    })
                }

            })
    }

    render() {
        let { message, subject } = this.props.location.query
        return <Formsy.Form ref='form' onValidSubmit={this.submitForm.bind(this)} className='form'>
                    {this.state.message ? <div className='alert' role='alert'>{this.state.message}</div> : null}
                    <Dropdown name='subject' trigger='Выберите тему сообщения' items={[
                        {name: 'Вопрос по баллам'},
                        {name: 'Вопрос по чекам'},
                        {name: 'Получение выигрыша'},
                        {name: 'Другая тема'},
                    ]} validations='minLengthOrEmpty:1' value={subject}/>
                    <Input name='phone' placeholder='Телефон для связи' validations='minLengthOrEmpty:1' value=''/>
                    <Textarea name='message' placeholder='Ваше сообщение' validations='minLengthOrEmpty:1' value={message}/>
                    <button type='submit' disabled={this.state.disabled}>
                        {this.state.disabled ? <img src='/layout/images/loading.gif' /> : null}
                        Отправить
                    </button>
                </Formsy.Form>
    }
}

export default FeedbackForm
