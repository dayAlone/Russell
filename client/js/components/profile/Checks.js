import React, { Component } from 'react'
import { Link } from 'react-router'
import Helmet from 'react-helmet'
import { bindActionCreators } from 'redux'
import * as actionCreators from '../../actions/profile'
import { connect } from 'react-redux'

@connect(state => ({checks: state.profile.checks}), dispatch => ({actions: bindActionCreators(actionCreators, dispatch)}))
class ProfileChecks extends Component {

    render() {
        return <div>
            <Helmet title='Russell Hobbs | Личный кабинет | Чеки'/>
            123
        </div>
    }
}

export default ProfileChecks
