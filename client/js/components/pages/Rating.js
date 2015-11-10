import React, { Component } from 'react'
import Helmet from 'react-helmet'
import ReactDOM from 'react-dom'
import ReactPaginate from 'react-paginate'

import Formsy from 'formsy-react'
import {Dropdown, RadioGroup} from '../forms/'
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
        perPage: 50,
        offset: 0,
        data: [],
        url: '/admin/checks/get/',
        timer: false,
        game: 'kitchen',
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
        this.getGamesList()
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
    getGamesList() {
        if (this.state.games.length === 0 && this.props.games.length > 0) {
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
    componentDidUpdate() {
        this.getGamesList()
    }
    render() {
        let {game, games, perPage} = this.state
        let dates = []
        games.filter(el => (el.code === game)).map(el => {
            el.raffles.map(d => {
                dates.push({name: moment(d[0]).format('DD.MM.YYYY'), code: JSON.stringify(d)})
            })
        })
        return <div className='rating'>
            <Helmet title='Russell Hobbs | Рейтинг победителей'/>
            <Formsy.Form ref='form' className='form rating__title' onChange={this.handleFormChange.bind(this)}>
                <h3>Рейтинг участников</h3>
                <div className='rating__select'>
                    <Dropdown name='game' className='dropdown--small' items={games.map(el => {
                        return {name: el.name, code: el.code}
                    })} value={game} />
                </div>
                <div className='rating__select'>
                    <h3>от</h3>
                    <Dropdown name='ruffle' className='dropdown--small dropdown--dates' items={dates} value='kitchen'/>
                    <span>Дата розыгрыша</span>
                </div>
                <div className='rating__tools'>
                    <div className='rating__pages'>
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
                    <div className='rating__shows'>
                        <RadioGroup name='limit' title='Показывать по:' items={[
                            {name: '50', code: 50},
                            {name: '100', code: 100},
                            {name: '200', code: 200},
                        ]} value={perPage}/>
                    </div>
                </div>
            </Formsy.Form>
            <div className='table'>
                <div className='table__title'>
                    <div className='table__col'>Место</div>
                    <div className='table__col left'>Участник</div>
                    <div className='table__col'>Набрано баллов</div>
                    <div className='table__col'>id участника</div>
                </div>
                {this.state.data.length > 0 ?
                    this.state.data.map((el, i) => {
                        return null
                    })
                    : <div className='table__row table__row--message center'>
                        Не найдено ни одного чека.
                    </div>}
            </div>
            <Formsy.Form className='form rating__title' onChange={this.handleFormChange.bind(this)}>
                <div className='rating__tools'>
                    <div className='rating__pages'>
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
                    <div className='rating__shows'>
                        <RadioGroup name='limit' title='Показывать по:' items={[
                            {name: '50', code: 50},
                            {name: '100', code: 100},
                            {name: '200', code: 200},
                        ]} value={perPage}/>
                    </div>
                </div>
            </Formsy.Form>
        </div>
    }
}

export default Raring
