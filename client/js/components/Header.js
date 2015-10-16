import React, { Component } from 'react';
import UserInfo from './UserInfo';
class Header extends Component {
    render() {
        return <div className='header'>
            <div className='header__col'>
                <a href='/' className='header__logo'>
                    <img src='/layout/images/svg/logo.svg' />
                </a>
            </div>
            <div className='header__col right'>
                <img src='/layout/images/svg/title-description.svg' className='header__title' />
            </div>
            <div className='header__links header__col right'>
                <UserInfo />
            </div>
        </div>;
    }
}

export default Header;
