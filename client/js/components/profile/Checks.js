import React, { Component } from 'react'
import { Link } from 'react-router'
import Helmet from 'react-helmet'
import { bindActionCreators } from 'redux'
import * as actionCreators from '../../actions/profile'
import { connect } from 'react-redux'
import AddCheckModal from './blocks/AddCheckModal'

import moment from 'moment'
import { findDOMNode } from 'react-dom'

import 'react-photoswipe/lib/photoswipe.css'
import {PhotoSwipe} from 'react-photoswipe'

import { Dropdown } from '../forms/'
import Formsy from 'formsy-react'

class Check extends Component {
    state = {hidden: true, sizes: false}
    handleClick(e) {
        this.setState({hidden: !this.state.hidden})

        e.preventDefault()
    }
    handleClickPreview(link) {
        return (e) => {
            this.props.openPhotoSwipe(link)
            e.preventDefault()
        }

    }
    render() {
        let {list, handleDropdown, current} = this.props
        let {_id, organisation, inn, eklz, date, time, total, kpk_number, kpk_value, photo, status, status_comment, count, vinner, products, until, created, photo2} = this.props.data
        let available = count - products.length
        let condition
        switch (status) {
        case 'canceled':
            condition = {
                message: 'Отклонен',
                class: 'canceled'
            }
            break
        case 'active':
            condition = {
                message: 'Активен',
                class: 'active'
            }
            break
        default:
            condition = {
                message: 'На модерации',
                class: 'moderation'
            }
        }
        if (moment(until) < moment()) {
            condition = {
                message: 'Сыгран',
                class: 'inactive'
            }
        }
        return <div className='table__row check'>
            <div className='table__col left'>
                <span>{list ? <Formsy.Form ref='check-select'>
                    <Dropdown
                        name='current'
                        onChange={handleDropdown}
                        value={current}
                        items={list} />
                </Formsy.Form> : `ID: ${_id}`}</span><br/>
                <div className={`check__info ${!this.state.hidden ? 'check__info--visible' : ''}`}>
                    {organisation ? <span>Организация: {organisation}<br/></span> : null}
                    <span>Дата: {date}</span><br/>
                    <span>Время: {time}</span><br/>
                    <span>Сумма: {total}</span><br/>
                    <a href='#' ref='photo' onClick={this.handleClickPreview(photo)} className='check__preview' style={{backgroundImage: `url(${photo})`}}></a>
                    {photo2 ? <a href='#' ref='photo2' onClick={this.handleClickPreview(photo2)} className='check__preview' style={{backgroundImage: `url(${photo2})`}}></a> : null }
                </div>
                <a href='#' className='check__show' onClick={this.handleClick.bind(this)}>{!this.state.hidden ? 'Скрыть' : 'Показать'} детали</a>
            </div>
            <div className='table__col' dangerouslySetInnerHTML={{__html: moment(created).format('DD.MM.YYYY<br/> HH:mm')}} />
            <div className='table__col left'>
                <div className={`check__status check__status--${condition.class}`}>{condition.message}</div>
                {status_comment ? <div className='check__comment' data-text={status_comment}>?</div> : null}
            </div>
            <div className='table__col'>
                {products.length > 0 ?
                    products.map((el, i) => {
                        return <div key={i}><a href={`/catalog/product/${el.product.code}/`} target='_blank'>{el.product.name}</a><br/><br/></div>
                    })
                    : 'нет'}
            </div>
            <div className='table__col'>
                {status === 'active' ? available : 0}
                <br />
                {available > 0 && status === 'active' ? <Link to='/catalog/' className='check__connect'>связать</Link> : null}
            </div>
            <div className='table__col'>{moment(until).format('DD.MM.YYYY')}</div>
            <div className='table__col'>{vinner ? <Link to='/profile/prizes/' className='check__vinner'>Да</Link> : null}</div>
            {condition.class === 'canceled' ?
                <a href='#' onClick={this.props.openModal(this.props.data)} className='check__edit'><img src='/layout/images/svg/pencil.svg' width='20'/></a>
                : null}
        </div>
    }
}

@connect(state => ({checks: state.profile.checks}), dispatch => ({actions: bindActionCreators(actionCreators, dispatch)}))
class ProfileChecks extends Component {
    state = {photoswipe: false, image: [], current: 0}
    openPhotoSwipe(image) {

        let img = new Image()
        img.onload = () => {
            this.setState({photoswipe: true, image: [{src: image, w: img.width, h: img.height}]})
            $('body').addClass('photoswipe-open')
        }
        img.src = image.indexOf('http') === -1 ? `http://${location.hostname}${location.port ? ':' + location.port : ''}${image}` : image


    }
    closePhotoSwipe() {
        $('body').removeClass('photoswipe-open')
        this.setState({photoswipe: false})
    }
    componentDidUpdate() {
        this.checkHeight()
    }
    componentDidMount() {
        if (this.props.checks.length === 0) {
            this.props.actions.getChecks()
        }

        $(window).on('resize', this.checkHeight.bind(this))
        this.checkHeight()
    }

    componentWillUnmount() {
        $(window).off('resize')
    }
    handleDropdown(el) {
        this.setState({current: el.code})
    }
    openModal(data) {
        return (e) => {
            e.preventDefault()
            this.refs.modal.getWrappedInstance().show(data)
        }
    }
    checkHeight() {
        if ($(window).width() < 768) {
            $('.table__title .table__col').each((i, el) => {
                $(el).css({
                    minHeight: $('.table__row:last-of-type .table__col:nth-child(' + (i + 1) + ')').outerHeight()
                })
            })
        }
    }
    render() {
        let checks = this.props.checks.map((el, i) => (<Check openModal={this.openModal.bind(this)} openPhotoSwipe={this.openPhotoSwipe.bind(this)} key={i} data={el}/>))
        let last
        if (this.props.checks.length > 0) {
            last = <Check
                        openModal={this.openModal.bind(this)}
                        openPhotoSwipe={this.openPhotoSwipe.bind(this)}
                        data={this.props.checks[this.state.current]}
                        current={this.state.current}
                        handleDropdown={this.handleDropdown.bind(this)}
                        list={this.props.checks.map((el, i) => {
                            return {
                                name: `ID: ${el._id}`,
                                code: i
                            }
                        })}/>
        }
        //<a href='#' onClick={this.openModal()} className='button button--small'>Добавить чек</a>
        return <div className={'checks checks--' + checks.length}>
            <Helmet title='Russell Hobbs | Личный кабинет | Чеки'/>

            <div className='table checks__table'>
                <div className='table__title'>
                    <div className='table__col'>Данные<br/> чека</div>
                    <div className='table__col'>Дата<br/> добавления</div>
                    <div className='table__col left'>Статус<br/> чека</div>
                    <div className='table__col'>Связанные<br/> товары</div>
                    <div className='table__col'>Доступно<br/> для связки</div>
                    <div className='table__col'>Дата<br/> розыгрыша</div>
                    <div className='table__col'>Выигрыш<br/> чека</div>
                </div>
                {this.props.checks.length === 0 ?
                    <div className='table__row table__row--message center'>
                        У вас нет ни одно чека.
                    </div>
                : checks}
                {last}
            </div>
            <AddCheckModal openPhotoSwipe={this.openPhotoSwipe.bind(this)} ref='modal' />
            <PhotoSwipe isOpen={this.state.photoswipe} options={{shareEl: false, index: this.state.index}} items={this.state.image} onClose={this.closePhotoSwipe.bind(this)}/>
        </div>
    }
}

export default ProfileChecks
