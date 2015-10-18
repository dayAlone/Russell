import React, { Component } from 'react';
import UserInfo from '../UserInfo';
import { Link } from 'react-router';
class Header extends Component {

    render() {
        return <div className='header'>
            <div className='header__col'>
                <Link to='/' className='header__logo'>
                    <img src={`/layout/images/svg/logo.svg`} />
                </Link>
            </div>
            <div className='header__col right'>
                <img src={`/layout/images/svg/title-description.svg`} className='header__title' />
            </div>
            <UserInfo />
        </div>;
    }
}

export default Header;
