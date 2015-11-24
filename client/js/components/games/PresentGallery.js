import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Link } from 'react-router'
import * as actionCreators from '../../actions/login'
import { bindActionCreators } from 'redux'

@connect(state => ({isLogin: state.login.isLogin}), dispatch => ({actions: bindActionCreators(actionCreators, dispatch)}))
class PresentGallery extends Component {
    state = {
        perPage: 50,
        offset: 0,
        data: [],
        url: '/games/presents/get/',
        photoswipe: false,
        image: []
    }
    loadPresentsFromServer() {
        let {url, perPage, offset} = this.state
        let {type, id, sort, status} = this.refs.form.getCurrentValues()
        $.ajax({
            url: url,
            data: {limit: perPage, offset: offset, type: type, id: id, sort: sort, status: status},
            type: 'GET',
            success: data => {
                if (data) this.setState({data: data.list, pageNum: Math.ceil(data.meta.total_count / data.meta.limit)})
            },
            error: (xhr, status, err) => {
                console.error(url, status, err.toString())
            }
        })
    }
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
