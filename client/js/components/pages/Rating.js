import React, { Component } from 'react'
import Helmet from 'react-helmet'
import ReactDOM from 'react-dom'
import ReactPaginate from 'react-paginate'

import Formsy from 'formsy-react'
import {Input, Textarea, Dropdown, RadioGroup} from '../forms/'
import { connect } from 'react-redux'
import * as actionCreators from '../../actions/games'
import { bindActionCreators } from 'redux'
import moment from 'moment'


class Row extends Component {
    render() {

    }
}

@connect(state => ({ games: state.games.list }), dispatch => ({actions: bindActionCreators(actionCreators, dispatch)}))
class Raring extends Component {
    state = {
        perPage: 10,
        offset: 0,
        data: [],
        url: '/admin/checks/get/',
        timer: false,
        ignore: ['checks', 'present'],
        games: []
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
        //this.loadChecksFromServer()
        if (this.props.games.length === 0) this.props.actions.getGames()
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
    componentDidUpdate(prevProps) {
        if (prevProps.games.length === 0 && this.props.games.length > 0) {
            let games = []
            this.props.games.map(el => {
                if (this.state.ignore.indexOf(el.code) === -1) {
                    let raffles = [[el.start, el.raffles[0]]]
                    el.raffles.map((r, i) => {
                        if (moment(r) < moment() && el.raffles[i + 1]) {
                            raffles.push([r, el.raffles[i + 1]])
                        }
                    })
                    games.push({
                        name: el.name,
                        code: el.code,
                        raffles: raffles
                    })
                }
            })
            this.setState({
                games: games
            })
        }

    }
    render() {
        return <div className='rating'>
            <Helmet title='Russell Hobbs | Рейтинг победителей'/>
            <Formsy.Form ref='form' className='form' onChange={this.handleFormChange.bind(this)}>
                <div className='rating__title'>
                    <h3>Рейтинг участников</h3>
                </div>
                <Dropdown name='type' className='dropdown--small' items={[
                    {name: 'Собери коллекцию', code: 'kitchen'},
                    {name: 'История в деталях', code: 'test'},
                ]} value='kitchen'/>
                <RadioGroup name='limit' title='Показывать по:' items={[
                    {name: '50', code: 50},
                    {name: '100', code: 100},
                    {name: '200', code: 200},
                ]} value='50'/>
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

export default Raring
