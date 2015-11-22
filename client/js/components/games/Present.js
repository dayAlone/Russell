import React, { Component } from 'react'
import { connect } from 'react-redux'
import Title from '../layout/Title'

import { Link } from 'react-router'
import * as actionCreators from '../../actions/login'
import { bindActionCreators } from 'redux'

@connect(state => ({isLogin: state.login.isLogin}), dispatch => ({actions: bindActionCreators(actionCreators, dispatch)}))
class Present extends Component {
    openModal(e) {
        const { openModal } = this.props.actions
        openModal()
        e.preventDefault()
    }
    render() {
        return <div className='present'>
                <h2 className='center'>В подарок. Для себя</h2>
            </div>
    }
}
export default Present
