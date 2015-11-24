import React, { Component } from 'react'
import Helmet from 'react-helmet'
import ReactDOM from 'react-dom'
import ReactPaginate from 'react-paginate'

import IconSVG from 'svg-inline-loader/lib/component.jsx'
import Formsy from 'formsy-react'
import {Dropdown, RadioGroup} from '../forms/'

import 'react-photoswipe/lib/photoswipe.css'
import {PhotoSwipe} from 'react-photoswipe'

class Present extends Component {
    render() {
        let status_text = ''
        let { _id, status, image, likes } = this.props.el
        switch (status) {
        case 'active':
            status_text = 'Активен'
            break
        case 'canceled':
            status_text = 'Отклонен'
            break
        default:
            status_text = 'На модерации'
        }
        return <div className='check'>
            <div onClick={this.props.openPhotoSwipe(image)} className='check__image' style={{backgroundImage: `url(${image})`}}></div>
            <div className='check__likes'>
                <IconSVG src={require('svg-inline!../../../public/images/svg/heart.svg')}/> {likes.length}
            </div>
            {status === 'moderation' ? <div className='check__actions'>
                <a href='#' onClick={this.props.updatePresent(_id, 'canceled')} className='check__action check__action--cancel'>Отклонить</a>
                <a href='#' onClick={this.props.updatePresent(_id, 'active')} className='check__action check__action--active'>Принять</a>
            </div> : <div className={`check__status check__status--${status}`}>{status_text}</div>}
        </div>
    }
}

class AdminPresents extends Component {
    state = {
        perPage: 50,
        offset: 0,
        data: [],
        url: '/games/presents/get/',
        timer: false,
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
        let {limit, sort} = this.refs.form.getCurrentValues()
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
    updatePresent(id, status) {
        return (e) => {
            console.log(id, status)
            $.post('/admin/presents/update/', {
                id: id,
                status: status
            }, response => {
                if (!response.error) this.loadPresentsFromServer()
            })
            e.preventDefault()
        }
    }
    render() {
        return <div className='admin-checks'>
            <Helmet title='Russell Hobbs | Кабинет модератора | Фото'/>
            <PhotoSwipe
                isOpen={this.state.photoswipe}
                options={{shareEl: false}}
                items={this.state.image}
                onClose={this.closePhotoSwipe.bind(this)}/>
            <Formsy.Form ref='form' className='form' onChange={this.handleFormChange.bind(this)}>
                <Dropdown name='status' className='dropdown--small' items={[
                    {name: 'Все', code: 'all'},
                    {name: 'Активен', code: 'active'},
                    {name: 'На модерации', code: 'moderation'},
                    {name: 'Отклонен', code: 'canceled'}
                ]} value='all'/>
                <Dropdown name='sort' className='dropdown--small' items={[
                    {name: 'Сортировка: добавление', code: 'created'},
                    {name: 'Сортировка: рейтинг', code: 'likes'}
                ]} value='created'/>
                <RadioGroup name='limit' title='Показывать по:' items={[
                    {name: '50', code: 50},
                    {name: '100', code: 100},
                    {name: '150', code: 150},
                ]} value='50'/>
            </Formsy.Form>
            <div className='admin-presents'>

            {this.state.data.length > 0 ?
                this.state.data.map((el, i) => {
                    return <Present el={el} key={i} updatePresent={this.updatePresent.bind(this)} openPhotoSwipe={this.openPhotoSwipe.bind(this)}/>
                })
                : <div className='table__row table__row--message center'>
                    Не найдено ни одной фотографии.
                </div>}
            </div>

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
    }
}

export default AdminPresents
