import React, { Component } from 'react'
import { Link } from 'react-router'

import { connect } from 'react-redux'
@connect()
class Profile extends Component {

    render() {
        return <div className='page page--profile'>
            <div className='text'>
                <h2>Личный кабинет</h2>
                <br/><br/><br/><br/>
            </div>
        </div>
    }
}

export default Profile
