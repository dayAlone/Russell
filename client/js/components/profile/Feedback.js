import React, { Component } from 'react'
import Helmet from 'react-helmet'
import Info from './blocks/Info'
import FeedbackForm from './blocks/FeedbackForm'

class ProfileFeedback extends Component {
    render() {
        return <div className='feedback'>
            <Helmet title='Russell Hobbs | Личный кабинет | Обратная связь'/>
            <div>
                <div className='profile__col'>
                    <Info />
                    <div className='feedback__text'>
                        Обращаем ваше внимание, что срок ответа на запрос составляет не более 3-х рабочих дней. <br />Ответ на запрос направляется на электронный адрес, указанный при регистрации на сайте (из вашего профиля социальной сети).
                    </div>
                </div>
                <div className='profile__col'>
                    <FeedbackForm location={this.props.location}/>
                </div>
            </div>
        </div>
    }
}

export default ProfileFeedback
