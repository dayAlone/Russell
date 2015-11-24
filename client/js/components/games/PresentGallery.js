import React, { Component } from 'react'
import { connect } from 'react-redux'

import ReactPaginate from 'react-paginate'

import IconSVG from 'svg-inline-loader/lib/component.jsx'
import Formsy from 'formsy-react'
import Spinner from '../ui/Spinner'
import {Dropdown, RadioGroup} from '../forms/'

import 'react-photoswipe/lib/photoswipe.css'
import {PhotoSwipe} from 'react-photoswipe'

import { Link } from 'react-router'
import * as actionCreators from '../../actions/login'
import { bindActionCreators } from 'redux'

class Present extends Component {
    handleClick(e) {
        if (!this.props.user) this.props.openModal()
        else this.props.likePresent(this.props.el._id)()
        e.preventDefault()
    }
    render() {
        let { user, el } = this.props
        let { image, likes } = el
        let liked = likes.indexOf(user._id) !== -1

        return <div className='present-item'>
            <div onClick={this.props.openPhotoSwipe(image)} className='present-item__image' style={{backgroundImage: `url(${image})`}}></div>
            <a href='#' onClick={this.handleClick.bind(this)} className={`present-item__likes ${liked ? 'present-item__likes--liked' : ''}`}>
                <IconSVG src={require('svg-inline!../../../public/images/svg/heart-border.svg')}/> {likes.length}
            </a>
        </div>
    }
}

@connect(state => ({isLogin: state.login.isLogin, user: state.login.data }), dispatch => ({actions: bindActionCreators(actionCreators, dispatch)}))
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
        if (e) e.preventDefault()
    }
    loadPresentsFromServer() {
        let { url, perPage, offset } = this.state
        let { type, sort, status, direction } = this.refs.form.getCurrentValues()
        $.ajax({
            url: url,
            data: {
                limit: perPage,
                offset: offset,
                direction: direction,
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
    handleFormChange(fields) {
        let { limit } = fields
        this.setState({perPage: limit}, this.loadPresentsFromServer)
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
    likePresent(id) {
        return () => {
            $.post('/profile/presents/like/', {
                id: id
            }, response => {
                if (!response.error) this.loadPresentsFromServer()
            })
        }
    }
    render() {
        return <div className='present'>
            <h2 className='center'>В подарок. Для себя</h2>
            <h4 className='center'>Галерея фотографий</h4>
            <img src={`/layout/images/line.png`} width='100%' className='text__divider' height='2'/>
            <div className='present__gallery'>

                    <div className='present__toolbar'>
                        <Formsy.Form ref='form' className='form' onChange={this.handleFormChange.bind(this)}>
                            <Dropdown name='sort' className='dropdown--border' items={[
                                {name: 'Сортировка по дате добавления', code: 'created'},
                                {name: 'Сортировка по рейтингу', code: 'likes'}
                            ]} value='likes'/>
                            <RadioGroup name='direction' className='direction' items={[
                                {name: <IconSVG src={require('svg-inline!../../../public/images/svg/arrow-up.svg')}/>, code: -1},
                                {name: <IconSVG src={require('svg-inline!../../../public/images/svg/arrow-down.svg')}/>, code: 1}
                            ]} value={-1}/>
                            <RadioGroup name='limit' title='Показывать по:' items={[
                                {name: '50', code: 50},
                                {name: '100', code: 100},
                                {name: '150', code: 150},
                            ]} value={this.state.perPage}/>
                        </Formsy.Form>
                    </div>
                    <div className='present__list'>
                        {this.state.data.length > 0 ? this.state.data.map((el, i) => {
                            return <Present el={el} key={i} likePresent={this.likePresent.bind(this)} openModal={this.openModal.bind(this)} openPhotoSwipe={this.openPhotoSwipe.bind(this)} user={this.props.user}/>
                        }) : <Spinner/>}
                    </div>
                    <div className='present__footer'>
                        <Formsy.Form className='form' onChange={this.handleFormChange.bind(this)}>
                            <img src={`/layout/images/line.png`} width='100%' className='text__divider' height='2'/>
                            <div className='present__col'>
                                {this.state.pageNum > 1 ? <ReactPaginate
                                    previousLabel={'пред.'}
                                    nextLabel={'след.'}
                                    breakLabel={<li className='break'><a href=''>...</a></li>}
                                    pageNum={this.state.pageNum}
                                    marginPagesDisplayed={2}
                                    pageRangeDisplayed={5}
                                    clickCallback={this.handlePageClick.bind(this)}
                                    containerClassName={'pagination'}
                                    subContainerClassName={'pages pagination'}
                                    activeClassName={'active'} /> : null}
                            </div>
                            <div className='present__col center'>
                                {this.props.isLogin ?
                                    <Link to='/games/present/make/' className='button button--small'>Добавить работу</Link>
                                    : <a href='#' onClick={this.openModal.bind(this)} className='button button--small'>Добавить работу</a>}
                            </div>
                            <div className='present__col'>
                                <RadioGroup name='limit' title='Показывать по:' items={[
                                    {name: '50', code: 50},
                                    {name: '100', code: 100},
                                    {name: '150', code: 150},
                                ]} value={this.state.perPage}/>
                            </div>



                    </Formsy.Form>
                    </div>
                <PhotoSwipe
                    isOpen={this.state.photoswipe}
                    options={{shareEl: false}}
                    items={this.state.image}
                    onClose={this.closePhotoSwipe.bind(this)}/>
            </div>
        </div>
    }
}


export default PresentGallery
