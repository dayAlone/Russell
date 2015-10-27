import React, { Component } from 'react'
import Helmet from 'react-helmet'
import Info from './blocks/Info'

class ProfileIndex extends Component {

    render() {
        return <div>
            <Helmet title='Russell Hobbs | Личный кабинет'/>
            <div className='info__col'><Info /></div>
        </div>
    }
}

export default ProfileIndex
