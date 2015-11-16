import React, { Component } from 'react'
import { PropTypes } from 'react-router'
import { IndexLink, Link } from 'react-router'
import { Dropdown } from '../components/forms/'
import Formsy from 'formsy-react'
import { connect } from 'react-redux'

class ProfileDropdownNav extends Component {
    handleDropdown(path) {
        this.context.history.pushState(null, path.code)
    }
    render() {
        return <div className='profile__dropdown'>
            <Formsy.Form ref='form'>
                <Dropdown name='nav' onChange={this.handleDropdown.bind(this)} items={this.props.items} value={this.props.location.pathname}/>
            </Formsy.Form>
        </div>
    }
}

ProfileDropdownNav.contextTypes = { history: PropTypes.history }

@connect(state => ({isLogin: state.login.isLogin}))
class Profile extends Component {
    componentDidUpdate() {
        if (!this.props.isLogin) location.href = '/'
    }

    render() {
        let nav = [
            {name: 'Общая информация', link: '/profile/'},
            {name: 'Мои чеки', link: '/profile/checks/'},
            {name: 'Избранное', link: '/profile/favorites/'},
            //{name: 'Статистика', link: '/profile/statistic/'},
            //{name: 'Мои выигрыши', link: '/profile/prizes/'},
            {name: 'Обратная связь', link: '/profile/feedback/'},
        ]
        let dropdownNav = nav.map(el => {
            return {
                name: el.name,
                code: el.link
            }
        })
        return <div className='page page--profile profile'>
            <div className='text'>
                <h2>Личный кабинет</h2>
                <ProfileDropdownNav items={dropdownNav} location={this.props.location}/>
                <div className='profile__nav'>
                    {nav.map((el, i) => {
                        if (i === 0 && this.props.location.pathname !== '/profile/') {
                            return <IndexLink key={i} to='/profile/' className='profile__link' activeClassName='profile__link--active'>Общая информация</IndexLink>
                        }
                        return <Link key={i} to={el.link} className='profile__link' activeClassName='profile__link--active'>{el.name}</Link>
                    })}


                </div>
                {this.props.children}
            </div>
        </div>
    }
}


export default Profile
