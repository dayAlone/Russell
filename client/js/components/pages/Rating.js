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
        limit: 50,
        offset: 0,
        data: [],
        url: '/games/rating/get/',
        timer: false,
        game: 'kitchen',
        ignore: ['checks', 'present'],
        games: [],
        ruffle: false,
        currentPage: 1
    }
    loadRatingFromServer() {
        let {url, limit, offset} = this.state
        let {game, ruffle} = this.refs.form_top.getCurrentValues()
        $.ajax({
            url: url,
            data: {limit: limit, offset: offset, game: game, ruffle: ruffle},
            type: 'GET',
            success: data => {
                console.log(data)
                if (data) this.setState({data: data.list, pageNum: Math.ceil(data.meta.total_count / data.meta.limit)})
            },
            error: (xhr, status, err) => {
                console.error(url, status, err.toString())
            }
        })
    }
    componentDidMount() {
        //this.loadRatingFromServer()
        this.getGamesList()
        if (this.props.games.length === 0) this.props.actions.getGames()
    }
    handlePageClick(data) {
        let selected = data.selected
        let offset = Math.ceil(selected * this.state.limit)

        this.setState({offset: offset, currentPage: selected}, () => {
            this.loadRatingFromServer()
        })
    }
    handleTopFormChange() {
        let values = this.refs.form_top.getCurrentValues()
        let changes = false;
        ['limit', 'game', 'ruffle'].map(el => {
            if (values[el] !== this.state[el]) {
                changes = true
            }
        })

        if (changes) {
            let { limit, game, ruffle } = values
            this.setState({
                limit: limit,
                game: game,
                ruffle: ruffle
            }, () => {
                this.loadRatingFromServer()
            })
        }
    }
    handleBottomFormChange() {
        let { limit } = this.refs.form_down.getCurrentValues()
        this.setState({
            limit: limit
        }, () => {
            this.loadRatingFromServer()
        })
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
        let {game, games, limit, ruffle, pageNum, currentPage} = this.state
        let dates = []
        games.filter(el => (el.code === game)).map(el => {
            el.raffles.map(d => {
                dates.push({name: moment(d[0]).format('DD.MM.YYYY'), code: JSON.stringify(d)})
            })
        })
        return <div className='rating'>
            <Helmet title='Russell Hobbs | Рейтинг победителей'/>
            <Formsy.Form ref='form_top' className='form rating__title' onChange={this.handleTopFormChange.bind(this)}>
                <h3>Рейтинг участников</h3>
                <div className='rating__select'>
                    <Dropdown name='game' className='dropdown--small' items={games.map(el => {
                        return {name: el.name, code: el.code}
                    })} value={game} />
                </div>
                <div className='rating__select'>
                    <h3>от</h3>
                    <Dropdown name='ruffle' className='dropdown--small dropdown--dates' items={dates} value={ruffle ? ruffle : dates[0] ? dates[0].code : null}/>
                    <span>Дата розыгрыша</span>
                </div>
                <div className='rating__tools'>
                    <div className='rating__pages'>
                        {pageNum > 1 ? <ReactPaginate
                            previousLabel={'пред.'}
                            nextLabel={'след.'}
                            breakLabel={<li className='break'><a href=''>...</a></li>}
                            pageNum={pageNum}
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
                        ]} value={limit}/>
                    </div>
                </div>
            </Formsy.Form>
            <div className='table'>
                <div className='table__title'>
                    <div className='table__col'>Место</div>
                    <div className='table__col left'>Участник</div>
                    <div className='table__col'>Набрано баллов</div>
                </div>
                {this.state.data.length > 0 ?
                    this.state.data.map((el, i) => {
                        return <div className='table__row' key={i}>
                            <div className='table__col'><div className='rating__position'>{limit * (currentPage - 1) + i + 1}</div></div>
                            <div className='table__col left'>
                                <div className='rating__image' style={{backgroundImage: `url(${el._id.photo ? el._id.photo : '/layout/images/svg/avatar.svg'})`}} />
                                <div className='rating__name'>{el._id.displayName.split(' ')[0]}<br/>{el._id.displayName.split(' ')[1]}</div>
                            </div>
                            <div className='table__col'><div className='rating__total'>{el.total}</div></div>
                        </div>
                    })
                    : <div className='table__row table__row--message center'>
                        Рейтинг пуст.
                    </div>}
            </div>
            <Formsy.Form className='form rating__title' ref='form_down' onChange={this.handleBottomFormChange.bind(this)}>
                <div className='rating__tools'>
                    <div className='rating__pages'>
                        {pageNum > 1 ? <ReactPaginate
                            previousLabel={'пред.'}
                            nextLabel={'след.'}
                            breakLabel={<li className='break'><a href=''>...</a></li>}
                            pageNum={pageNum}
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
                            {name: '200', code: 200}
                        ]} value={limit}/>
                    </div>
                </div>
            </Formsy.Form>
        </div>
    }
}

export default Raring
