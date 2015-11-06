import React, { Component } from 'react'
import UserInfo from '../UserInfo'
import { Link } from 'react-router'
import Modal from '../ui/Modal'
import Nav from './MobileNav'

class HeaderAdmin extends Component {
    render() {
        return <div className='header header--admin'>
            <div className='wrap'>
                <div className='header__col'>
                    <Link to='/' className='header__logo'>
                        <img src={`/layout/images/svg/logo.svg`} />
                    </Link>
                </div>
                <div className='header__col center'>
                    <h4>Кабинет модератора</h4>
                </div>
                <UserInfo />
            </div>
        </div>
    }
}

export default HeaderAdmin
