import React, { Component } from 'react'
import { connect } from 'react-redux'

import ReactPaginate from 'react-paginate'

import IconSVG from 'svg-inline-loader/lib/component.jsx'
import Formsy from 'formsy-react'
import {Dropdown, RadioGroup} from '../forms/'

import 'react-photoswipe/lib/photoswipe.css'
import {PhotoSwipe} from 'react-photoswipe'

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
    state = {
        perPage: 50,
        offset: 0,
        data: [],
        url: '/games/presents/get/',
        photoswipe: false,
        image: []
    }
    loadPresentsFromServer() {
        let { url, perPage, offset } = this.state
        let { type, sort, status } = this.refs.form.getCurrentValues()
        $.ajax({
            url: url,
            data: {
                limit: perPage,
                offset: offset,
                type: type,
                sort: sort,
                status: status
            },
            type: 'GET',
            success: data => {
                if (data) {
                    this.setState({
                        data: data.list,
                        pageNum: Math.ceil(data.meta.total_count / data.meta.limit)
                    })
                }
            },
            error: (xhr, status, err) => {
                console.error(url, status, err.toString())
            }
        })
    }
    componentDidMount() {
        this.loadPresentsFromServer()
    }
    handlePageClick(data) {
        let selected = data.selected
        let offset = Math.ceil(selected * this.state.perPage)
        this.setState({offset: offset}, () => {
            this.loadPresentsFromServer()
        })
    }
    handleFormChange() {
        let { limit } = this.refs.form.getCurrentValues()
        this.setState({perPage: limit}, () => {
            this.loadPresentsFromServer()
        })
    }
    openPhotoSwipe(image) {
        return (e) => {
            let img = new Image()
            img.onload = () => {
                this.setState({photoswipe: true, image: [{src: image, w: img.width, h: img.height}]})
                $('body').addClass('photoswipe-open')
            }
            img.src = image.indexOf('http') === -1 ? `http://${location.hostname}${location.port ? ':' + location.port : ''}${image}` : image

            e.preventDefault()
        }
    }
    closePhotoSwipe() {
        $('body').removeClass('photoswipe-open')
        this.setState({photoswipe: false})
    }
    render() {
        return <div className='present'>
            <h2 className='center'>В подарок. Для себя</h2>
            <h4 className='center'>Галерея фотографий</h4>
            <img src={`/layout/images/line.png`} width='100%' className='text__divider' height='2'/>
            <Formsy.Form ref='form' className='form' onChange={this.handleFormChange.bind(this)}>
                <Dropdown name='sort' className='dropdown--border' items={[
                    {name: 'Сортировка по дате добавления', code: 'created'},
                    {name: 'Сортировка по рейтингу', code: 'likes'}
                ]} value='likes'/>
                <RadioGroup name='limit' title='Показывать по:' items={[
                    {name: '50', code: 50},
                    {name: '100', code: 100},
                    {name: '150', code: 150},
                ]} value='50'/>
            </Formsy.Form>
            <PhotoSwipe
                isOpen={this.state.photoswipe}
                options={{shareEl: false}}
                items={this.state.image}
                onClose={this.closePhotoSwipe.bind(this)}/>
        </div>
    }
}


export default PresentGallery
