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

@connect(state => ({ games: state.games.list }), dispatch => ({actions: bindActionCreators(actionCreators, dispatch)}))
class Rating extends Component {
    state = {
        limit: 50,
        offset: 0,
        data: [],
        url: '/games/rating/get/',
        timer: false,
        game: this.props.location.query.game ? this.props.location.query.game : 'kitchen',
        accepted: ['test', 'kitchen'],
        games: [],
        raffle: false,
        currentPage: 1,
    }
    loadRatingFromServer() {
        let {url, limit, offset} = this.state
        let {game, raffle} = this.refs.form_top.getCurrentValues()
        $.ajax({
            url: url,
            data: {limit: limit, offset: offset, game: game, raffle: raffle},
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
        ['limit', 'game', 'raffle'].map(el => {
            if (values[el] !== this.state[el]) {
                changes = true
            }
        })

        if (changes) {
            let { limit, game, raffle } = values
            this.setState({
                limit: limit,
                game: game,
                raffle: raffle
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
                if (this.state.accepted.indexOf(el.code) !== -1) {
                    let list = [el.start].concat(el.raffles)
                    list = list.sort((a, b) => (moment(a) - moment(b)))
                    let raffles = [];
                    list.map((r, i) => {
                        if (moment(r) < moment() && list[i + 1]) {
                            raffles.push([r, list[i + 1]])
                        }
                    })
                    raffles = raffles.sort((a, b) => (moment(b[1]) - moment(a[1])))
                    if (raffles.length !== 0) {
                        games.push({
                            name: el.name,
                            code: el.code,
                            raffles: raffles
                        })
                    }
                }
            })
            if (games.length > 0) {
                this.setState({
                    games: games
                }, this.loadRatingFromServer)
            }
        }
    }
    componentDidUpdate(prevProps, prevState) {

        if (prevState.game !== this.state.game) {
            this.setState({ raffle: false }, this.getGamesList)
        }
        else this.getGamesList()
    }
    render() {
        let {game, games, limit, raffle, pageNum, currentPage} = this.state
        let dates = []
        games.filter(el => (el.code === game)).map(el => {
            el.raffles.map(d => {
                dates.push({name: moment(d[1]).format('DD.MM.YYYY'), code: JSON.stringify(d)})
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
                    <h3>к</h3>
                    <Dropdown name='raffle' className='dropdown--small dropdown--dates' items={dates}
                        value={raffle ? raffle : dates[0] ? dates[0].code : null}/>
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
                                <div className='rating__name'>{el._id.displayName.split(' ')[0]} <br/>{el._id.displayName.split(' ')[1]}</div>
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

export default Rating
