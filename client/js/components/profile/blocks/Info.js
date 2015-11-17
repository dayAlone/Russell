import React, { Component } from 'react'
import { connect } from 'react-redux'

import Spinner from '../../ui/Spinner'

import moment from 'moment'
import 'moment/locale/ru'


@connect(state => ({ user: state.login.data }))
class ProfileInfo extends Component {

    render() {
        if (this.props.user) {
            let { displayName: name, photo, created, email, providers, phone } = this.props.user
            console.log(phone)
            name = name.split(' ')
            created = moment(created).format('DD.MM.YYYY')
            return <div className='info'>
                    <div className='info__photo' style={{backgroundImage: `url(${photo ? photo : '/layout/images/svg/avatar.svg'})`}}/>
                    <div className='info__frame'>
                        <span className='info__name'>{name[0]}<br/>{name[1]}</span><br/>
                        <span className='info__date'>Дата регистрации: {created}</span>
                    </div>
                    <div className='info__links'>
                        <div className='info__link info__link--email'><img src='/layout/images/svg/profile-email.svg' width='30'/><span>{email}</span></div>
                        {providers[0] ?
                            <a href={providers[0].profile.profileUrl} target='_blank' className='info__link info__link--profile'>
                                <img src='/layout/images/svg/profile-link.svg' width='30'/>
                                <span>{providers[0].profile.profileUrl}</span>
                            </a>
                            : null}
                        {phone ? <div className='info__link info__link--phone'><img src='/layout/images/svg/profile-phone.svg' width='30'/><span>{phone}</span></div> : null}

                        <a href='#' className='info__edit'>Изменить личные данные</a>
                        <a href='#' className='info__edit'>Изменить пароль</a>
                    </div>
                </div>
        }
        return <Spinner />
    }
}

export default ProfileInfo
