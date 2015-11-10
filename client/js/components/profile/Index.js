import React, { Component } from 'react'
import Helmet from 'react-helmet'
import Info from './blocks/Info'
import ChecksStat from './blocks/ChecksStat'
import GamesShortStat from './blocks/GamesShortStat'
class ProfileIndex extends Component {

    render() {
        return <div>
            <Helmet title='Russell Hobbs | Личный кабинет'/>
            <div>
                <div className='profile__col'><Info /></div>
                <div className='profile__col'>
                    <ChecksStat />
                </div>
            </div>
            <GamesShortStat />
        </div>
    }
}

export default ProfileIndex
