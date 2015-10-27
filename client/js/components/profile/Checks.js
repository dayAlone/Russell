import React, { Component } from 'react'
import { Link } from 'react-router'
import Helmet from 'react-helmet'

import { connect } from 'react-redux'
@connect()
class ProfileChecks extends Component {

    render() {
        return <div>
            <Helmet title='Russell Hobbs | Личный кабинет | Чеки'/>
            123
        </div>
    }
}

export default ProfileChecks
