import React, { Component } from 'react'
import Helmet from 'react-helmet'
import Info from './blocks/Info'
import Formsy from 'formsy-react'
import {Input, Textarea, Dropdown} from '../forms/'

Formsy.addValidationRule('minLengthOrEmpty', (values, value) => {
    return value && value.length >= length
})

class ProfileFeedback extends Component {
    state = { message: null }
    submitForm(e) {
        e.preventDefault()
    }
    render() {
        return <div className='feedback'>
            <Helmet title='Russell Hobbs | Личный кабинет | Обратная связь'/>
            <div className='profile__col'>
                <Info />
                <div className='feedback__text'>
                    Обращаем ваше внимание, что срок ответа запрос составляет не более 3-х рабочих дней. <br />Ответ на запрос направляется на электронный адрес, указанный при регистрации на сайте (из вашего профиля социальной сети).
                </div>
            </div>
            <div className='profile__col'>
                <Formsy.Form ref='form'>
                    {this.state.error ? <div className='alert alert-danger' role='alert'>{this.state.error}</div> : false}
                    <Dropdown name='theme' trigger='Выберите тему сообщения' items={[
                        {name: 'Вопрос по баллам'},
                        {name: 'Вопрос по чекам'},
                        {name: 'Получение выигрыша'},
                        {name: 'Другая тема'},
                    ]} validations='minLengthOrEmpty:1'/>
                <Input name='phone' placeholder='Телефон для связи' validations='minLengthOrEmpty:1'/>
                    <Textarea name='message' placeholder='Ваше сообщение' validations='minLengthOrEmpty:1'/>
                    <input type='submit' value='Отправить'/>
                </Formsy.Form>
            </div>
        </div>
    }
}

export default ProfileFeedback
