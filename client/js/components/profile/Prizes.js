import React, { Component } from 'react'
import { Link } from 'react-router'
import Helmet from 'react-helmet'
import { bindActionCreators } from 'redux'
import * as actionCreators from '../../actions/profile'
import { connect } from 'react-redux'

import moment from 'moment'

@connect(state => ({checks: state.profile.checks}), dispatch => ({actions: bindActionCreators(actionCreators, dispatch)}))
class ProfileFavorites extends Component {
    componentDidMount() {
        if (this.props.checks.length === 0) {
            this.props.actions.getChecks()
        }
    }
    render() {

        return <div className='checks'>
            <Helmet title='Russell Hobbs | Личный кабинет | Призы'/>
            123

        </div>
    }
}

export default ProfileFavorites
