import React, { Component } from 'react'
import Helmet from 'react-helmet'
import ReactDOM from 'react-dom'
import ReactPaginate from 'react-paginate'

import Formsy from 'formsy-react'
import { Dropdown } from '../forms/'
import { connect } from 'react-redux'
import * as actionCreators from '../../actions/games'
import { bindActionCreators } from 'redux'
import moment from 'moment'
import pluralize from '../../libs/pluralize'

@connect(state => ({ games: state.games.list, prizes: state.games.prizes }), dispatch => ({actions: bindActionCreators(actionCreators, dispatch)}))
class Winners extends Component {
    state = {
        data: [],
        url: '/games/winners/get/',
        game: this.props.location.query.game ? this.props.location.query.game : 'kitchen',
        accepted: ['test', 'kitchen', 'share-history', 'maraphon', 'heart', 'present'],
        games: [],
        raffle: false,
    }
    loadRatingFromServer() {
        let {url} = this.state
        let {game, raffle} = this.refs.form_top.getCurrentValues()
        game = this.props.games.filter(el => (el.code === game))[0]._id
        $.ajax({
            url: url,
            data: {game: game, raffle: raffle},
            type: 'GET',
            success: data => {
                if (data) this.setState({data: data.list})
            },
            error: (xhr, status, err) => {
                console.error(url, status, err.toString())
            }
        })
    }
    componentDidMount() {
        this.getGamesList()
        if (this.props.games.length === 0) this.props.actions.getGames()
        if (this.props.prizes.length === 0) this.props.actions.getPrizes()

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
        ['game', 'raffle'].map(el => {
            if (values[el] !== this.state[el]) {
                changes = true
            }
        })

        if (changes) {
            let { game, raffle } = values
            this.setState({
                game: game,
                raffle: raffle
            }, () => {
                this.loadRatingFromServer()
            })
        }
    }
    getGamesList() {
        if (this.state.games.length === 0 && this.props.games.length > 0) {
            let games = []
            this.props.games.map(el => {
                if (this.state.accepted.indexOf(el.code) !== -1) {
                    let list = [el.start].concat(el.raffles)
                    list = list.sort((a, b) => (moment(a) - moment(b)))
                    let raffles = []
                    list.map((r, i) => {
                        if (moment(list[i + 1]) < moment() && list[i + 1]) {
                            raffles.push([r, list[i + 1]])
                        }
                    })
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
        this.getGamesList()
        if (prevState.game !== this.state.game) this.setState({ raffle: false })
    }
    getRusults() {
        let { data, game } = this.state
        console.log(game)
        switch (game) {
        case 'test':
        case 'kitchen':
            return <div className='winners'>
                {data.map((el, i) => {
                    let { position, user, additional, prize } = el
                    return <div className={`winners__item winners__item--games-${position}`} key={i}>
                        <div className='winners__position'>
                            {position} место
                        </div>
                        <div className='winners__scores'>
                            <strong>{additional.scores}</strong><br/>
                            {pluralize(additional.scores, ['балл', 'балла', 'баллов', 'балла'])}
                        </div>
                        <div className='winners__photo' style={{backgroundImage: `url(${user.photo ? user.photo : '/layout/images/svg/avatar.svg'})`}}/>
                        <div className='winners__name'>{user.displayName}</div>
                        {prize ? <div className='winners__prize'>
                            <img src={prize.photo} alt='' /> {prize.name}
                        </div> : null}
                    </div>
                })}
            </div>
        default:

        }
    }
    render() {
        let {game, games, raffle, data} = this.state
        let dates = []
        games.filter(el => (el.code === game)).map(el => {
            el.raffles.map(d => {
                dates.push({name: moment(d[1]).format('DD.MM.YYYY'), code: JSON.stringify(d)})
            })
        })
        if (!raffle) console.log(dates[0])
        return <div className='rating'>
            <Helmet title='Russell Hobbs | Итоги конкурса'/>

                {games.length > 0 ? <Formsy.Form ref='form_top' className='form rating__title' onChange={this.handleTopFormChange.bind(this)}>
                    <h3>Победители конкурса</h3>
                    <div className='rating__select'>
                        <Dropdown name='game' className='dropdown--small' items={games.map(el => {
                            return {name: el.name, code: el.code}
                        })} value={game} />
                    </div>
                    <div className='rating__select'>
                        <h3>от</h3>
                        <Dropdown name='raffle' className='dropdown--small dropdown--dates' items={dates}
                            value={raffle ? raffle : dates[0] ? dates[0].code : null}
                            />
                        <span>Дата розыгрыша</span>
                    </div>
                    {data.length > 0 ? this.getRusults() : <div className='center padding'>
                        <h2>Список победителей будет опубликован в ближайшее время</h2>
                    </div>}
                </Formsy.Form> : <div className='center padding'>
                    <h2>Список победителей будет опубликован в ближайшее время</h2>
                </div> }


        </div>
    }
}

export default Winners
