import React, { Component } from 'react'
import Helmet from 'react-helmet'
import ReactDOM from 'react-dom'
import ReactPaginate from 'react-paginate'

import Formsy from 'formsy-react'
import {Input, Textarea, Dropdown, RadioGroup} from '../forms/'

import moment from 'moment'

class Check extends Component {
    render() {
        let {_id, status, created, user, until} = this.props.data
        let condition
        switch (status) {
        case 'correct':
            condition = {
                message: 'Прошел АВ',
                class: 'moderation'
            }
            break
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
        case 'added':
            condition = {
                message: 'Ждет отправки на АВ',
                class: 'moderation'
            }
            break
        default:
            condition = {
                message: 'Отправлен на АВ',
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
            <div className='table__col'>{_id}</div>
            <div className='table__col'>
                <div className={`check__status ${condition.class ? 'check__status--' + condition.class : ''}`}>{condition.message}</div>
            </div>
            <div className='table__col' dangerouslySetInnerHTML={{__html: moment(created).format('DD.MM.YYYY HH:mm')}}/>
            <div className='table__col'>
                <a href='#'>Посмотреть или изметь</a>
            </div>
            <div className='table__col'>{user.displayName}</div>
        </div>
    }
}

class AdminChecks extends Component {
    state = {
        perPage: 10,
        offset: 0,
        data: [],
        url: '/admin/checks/get/',
        timer: false
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
    render() {
        return <div className='admin-checks'>
            <Helmet title='Russell Hobbs | Кабинет модератора | Чеки'/>
            <Formsy.Form ref='form' className='form' onChange={this.handleFormChange.bind(this)}>
                <Dropdown name='type' className='dropdown--small' trigger='Выберите статус чека' items={[
                    {name: 'Все', code: 'all'},
                    {name: 'Прошел АВ', code: 'correct'},
                    {name: 'Ждет отправки на АВ', code: 'added'},
                    {name: 'Отправлен на АВ', code: 'processign'},
                    {name: 'Активен', code: 'active'},
                    {name: 'Отклонен', code: 'canceled'},
                    {name: 'Сыгран', code: 'gameover'},
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
                </div>
                {this.state.data.length > 0 ?
                    this.state.data.map((el, i) => {
                        return <Check key={i} data={el}/>
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
