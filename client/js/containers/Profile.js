import React, { Component } from 'react'
import { IndexLink, Link } from 'react-router'

import { connect } from 'react-redux'
@connect()
class Profile extends Component {

    render() {
        return <div className='page page--profile profile'>
            <div className='text'>
                <h2>Личный кабинет</h2>
                <div className='profile__nav'>
                    {[
                        {name: 'Общая информация', link: '/profile/'},
                        {name: 'Мои чеки', link: '/profile/checks/'},
                        {name: 'Избранное', link: '/profile/favorites/'},
                        {name: 'Статистика', link: '/profile/statistic/'},
                        {name: 'Мои выигрыши', link: '/profile/prizes/'},
                        {name: 'Обратная связь', link: '/profile/feedback/'},
                    ].map((el, i) => {
                        if (i === 0 && this.props.location.pathname !== '/profile/') {
                            return <IndexLink key={i} to='/profile/' className='profile__link' activeClassName='profile__link--active'>Общая информация</IndexLink>
                        }
                        return <Link key={i} to={el.link} className='profile__link' activeClassName='profile__link--active'>{el.name}</Link>
                    })}


                </div>
                {this.props.children}
                <br/><br/><br/>
            </div>
        </div>
    }
}

export default Profile
