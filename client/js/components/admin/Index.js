import React, { Component } from 'react'
import Helmet from 'react-helmet'
import ReactDOM from 'react-dom'
import ReactPaginate from 'react-paginate'

import Formsy from 'formsy-react'
import {Input, Textarea, Dropdown, RadioGroup} from '../forms/'
import CheckModal from './blocks/checkModal'

import moment from 'moment'
import 'react-photoswipe/lib/photoswipe.css'
import {PhotoSwipe} from 'react-photoswipe'

const getStatus = (status, until, vinner) => {
    if (vinner) {
        return {
            message: 'Выиграл',
            class: 'vinner'
        }
    }
    if (moment(until) < moment()) {
        return {
            message: 'Сыгран',
            class: 'inactive'
        }
    }

    switch (status) {
    case 'correct':
        return {
            message: 'Прошел АВ',
            class: 'moderation'
        }
    case 'canceled':
        return {
            message: 'Отклонен',
            class: 'canceled'
        }
    case 'check_canceled':
        return {
            message: 'Не прошел АВ',
            class: 'canceled'
        }
    case 'active':
        return {
            message: 'Активен',
            class: 'active'
        }
    case 'added':
        return {
            message: 'Ждет отправки на АВ',
            class: 'added'
        }
    case 'moderation':
        return {
            message: 'Ждет модерации',
            class: 'moderation'
        }
    default:
        return {
            message: 'Отправлен на АВ',
            class: 'processign'
        }
    }

}

class Check extends Component {
    render() {
        let {_id, status, created, user, until, vinner, products} = this.props.data
        let condition = getStatus(status, until, vinner)

        return <div className='table__row check'>
            <div className='table__col'>{_id}</div>
            <div className='table__col'>
                <div className={`check__status ${condition.class ? 'check__status--' + condition.class : ''}`}>{condition.message}</div>
            </div>
            <div className='table__col' dangerouslySetInnerHTML={{__html: moment(created).format('DD.MM.YYYY HH:mm')}}/>
            <div className='table__col'>
                <a href='#' onClick={this.props.openModal(this.props.data, condition.class)}>Редактировать</a>
            </div>
            <div className='table__col'>{user ? user.displayName : null}</div>
            <div className='table__col'>
                {products.length > 0 ?
                    products.map((el, i) => {
                        return <div key={i}><a href={`/catalog/product/${el.product.code}/`} target='_blank'>{el.product.name}</a><br/><br/></div>
                    })
                    : 'нет'}
            </div>

        </div>
    }
}

class AdminChecks extends Component {
    state = {
        perPage: 10,
        offset: 0,
        data: [],
        url: '/admin/checks/get/',
        timer: false,
        photoswipe: false,
        image: []
    }
    loadChecksFromServer() {
        let {url, perPage, offset} = this.state
        let {type, id} = this.refs.form.getCurrentValues()
        $.ajax({
            url: url,
            data: {limit: perPage, offset: offset, type: type, id: id},
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
        this.loadChecksFromServer()
    }
    handlePageClick(data) {
        let selected = data.selected
        let offset = Math.ceil(selected * this.state.perPage)

        this.setState({offset: offset}, () => {
            this.loadChecksFromServer()
        })
    }
    getFormResults() {
        let {limit} = this.refs.form.getCurrentValues()
        this.setState({perPage: limit}, () => {
            this.loadChecksFromServer()
        })
    }
    handleFormChange() {
        clearTimeout(this.state.timer)
        this.setState({timer: setTimeout(this.getFormResults.bind(this), 500)})
    }
    openModal(data, condition) {
        return (e) => {
            e.preventDefault()
            this.refs.modal.show(data, condition)
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.photoswipe === true && this.state.photoswipe === true) return false
        return true
    }
    openPhotoSwipe(image, sizes = {w: 0, h: 0}) {
        return (e) => {
            this.setState({photoswipe: true, image: [{src: image, w: sizes.w, h: sizes.h}]})
            $('body').addClass('photoswipe-open')
            e.preventDefault()
        }
    }
    closePhotoSwipe() {
        $('body').removeClass('photoswipe-open')
        this.setState({photoswipe: false})
    }
    render() {
        return <div className='admin-checks'>
            <Helmet title='Russell Hobbs | Кабинет модератора | Чеки'/>
            <PhotoSwipe
                isOpen={this.state.photoswipe}
                options={{shareEl: false}}
                items={this.state.image}
                onClose={this.closePhotoSwipe.bind(this)}/>
            <CheckModal loadChecksFromServer={this.loadChecksFromServer.bind(this)} openPhotoSwipe={this.openPhotoSwipe.bind(this)} ref='modal' />
            <Formsy.Form ref='form' className='form' onChange={this.handleFormChange.bind(this)}>
                <Dropdown name='type' className='dropdown--small' trigger='Выберите статус чека' items={[
                    {name: 'Все', code: 'all'},
                    {name: 'Ждет проверки модератором', code: 'moderation'},
                    {name: 'Ждет отправки на АВ', code: 'added'},
                    {name: 'Отправлен на АВ', code: 'processign'},
                    {name: 'Активен', code: 'active'},
                    {name: 'Отклонен', code: 'canceled'},
                    {name: 'Не прошел АВ', code: 'check_canceled'},
                    {name: 'Сыгран', code: 'gameover'},
                    {name: 'Выиграл', code: 'vinner'}
                ]} value=''/>
                <RadioGroup name='limit' title='Показывать по:' items={[
                    {name: '10', code: 10},
                    {name: '50', code: 50},
                    {name: '100', code: 100},
                ]} value='10'/>
                <Input name='id' placeholder='Поиск чека по ID' />
            </Formsy.Form>
            <div className='table admin-checks__table'>
                <div className='table__title'>
                    <div className='table__col'>ID</div>
                    <div className='table__col'>Статус чека</div>
                    <div className='table__col'>Дата добавления</div>
                    <div className='table__col'>Данные и фото чека</div>
                    <div className='table__col'>Загружен пользователем</div>
                    <div className='table__col'>Связанные товары</div>
                </div>
                {this.state.data.length > 0 ?
                    this.state.data.map((el, i) => {
                        return <Check key={i} openModal={this.openModal.bind(this)} data={el}/>
                    })
                    : <div className='table__row table__row--message center'>
                        Не найдено ни одного чека.
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

export default AdminChecks
