import React, { Component } from 'react'
import Helmet from 'react-helmet'
import ReactDOM from 'react-dom'
import ReactPaginate from 'react-paginate'

import Formsy from 'formsy-react'
import {Input, RadioGroup} from '../forms/'

import moment from 'moment'

class User extends Component {
    render() {
        let { displayName, email, created, providers } = this.props.data
        return <div className='table__row user'>
            <div className='table__col'>{displayName}</div>
            <div className='table__col'>{providers.length > 0 ? providers.map((el, i) => {
                return <a key={i} href={el.profile.profileUrl} target='_blank' className={`social social--${el.name}`}>
                    <img src={`/layout/images/svg/${el.name === 'facebook' ? 'fb' : 'vk'}.svg`} alt='' />
                </a>
            }) : null}</div>
            <div className='table__col'>{moment(created).format('DD.MM.YYYY HH:mm')}</div>
            <div className='table__col'><a href={`mailto:${email}`}>{email}</a></div>
            <div className='table__col'></div>
        </div>
    }
}

class AdminUsers extends Component {
    state = {
        perPage: 10,
        offset: 0,
        data: [],
        url: '/admin/users/get/',
        timer: false,
        photoswipe: false,
        image: []
    }
    loadUsersFromServer() {
        let {url, perPage, offset} = this.state
        let {query} = this.refs.form.getCurrentValues()
        $.ajax({
            url: url,
            data: {limit: perPage, offset: offset, query: query},
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
        this.loadUsersFromServer()
    }
    handlePageClick(data) {
        let selected = data.selected
        let offset = Math.ceil(selected * this.state.perPage)

        this.setState({offset: offset}, () => {
            this.loadUsersFromServer()
        })
    }
    getFormResults() {
        let {limit} = this.refs.form.getCurrentValues()
        this.setState({perPage: limit}, () => {
            this.loadUsersFromServer()
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
    render() {
        return <div className='admin-users'>
            <Helmet title='Russell Hobbs | Кабинет модератора | Пользователи'/>
            <Formsy.Form ref='form' className='form' onChange={this.handleFormChange.bind(this)}>

                <RadioGroup name='limit' title='Показывать по:' items={[
                    {name: '10', code: 10},
                    {name: '50', code: 50},
                    {name: '100', code: 100},
                ]} value='10'/>
                <Input name='query' placeholder='Поиск чека по имени или почте' />
            </Formsy.Form>
            <div className='table admin-users__table'>
                <div className='table__title'>
                    <div className='table__col'>Пользователь</div>
                    <div className='table__col'>Сеть</div>
                    <div className='table__col'>Дата регистрации</div>
                    <div className='table__col'>E-mail</div>
                    <div className='table__col'>Информация</div>
                </div>
                {this.state.data.length > 0 ?
                    this.state.data.map((el, i) => {
                        return <User key={i} openModal={this.openModal.bind(this)} data={el}/>
                    })
                    : <div className='table__row table__row--message center'>
                        Не найдено ни одного пользователя.
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

export default AdminUsers
