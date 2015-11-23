import React, { Component } from 'react'
import Helmet from 'react-helmet'
import { Link } from 'react-router'
import Spinner from '../ui/Spinner'

class ProfileIndex extends Component {

    render() {
        return <div>
            <Helmet title='Russell Hobbs | Личный кабинет | Мои фото'/>

            <Spinner/>

            <div className='center'>
                <Link to='/games/present/make/' className='button button--small'>Добавить фото</Link>
            </div>
        </div>
    }
}

export default ProfileIndex
