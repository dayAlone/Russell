import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Link } from 'react-router'
import * as actionCreators from '../../actions/login'
import { bindActionCreators } from 'redux'

@connect(state => ({isLogin: state.login.isLogin}), dispatch => ({actions: bindActionCreators(actionCreators, dispatch)}))
class PresentGallery extends Component {
    openModal(e) {
        const { openModal } = this.props.actions
        openModal()
        e.preventDefault()
    }
    render() {
        return <div className='present'>
            <h2 className='center'>В подарок. Для себя</h2>
            <h4 className='center'>Галерея фотографий</h4>
            <img src={`/layout/images/line.png`} width='100%' className='text__divider' height='2'/>
        </div>
    }
}


export default PresentGallery
