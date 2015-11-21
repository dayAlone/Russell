import React, { Component } from 'react'
import Helmet from 'react-helmet'
import ReactDOM from 'react-dom'
import ReactPaginate from 'react-paginate'
import { connect } from 'react-redux'
import { toObj } from 'form-data-to-object'
import Spinner from '../ui/Spinner'
import Formsy from 'formsy-react'
import {Dropdown, RadioGroup} from '../forms/'
import moment from 'moment'

import * as actionCreators from '../../actions/games'
import { bindActionCreators } from 'redux'


@connect(state => ({ games: state.games.list }), dispatch => ({actions: bindActionCreators(actionCreators, dispatch)}))
class Competition extends Component {
    state = {
        accepted: ['checks', 'kitchen', 'test'],
        game: false,
        raffle: false,
        data: [],
        list: false,
        raffles: false
    }
    componentDidMount() {
        if (this.props.games.length === 0) this.props.actions.getGames()
        this.setList()
    }
    componentDidUpdate(prevProps) {
        if (this.props.games.length > 0 && prevProps.games.length === 0) this.setList()
    }
    handleFormChange(fields) {
        if (!fields.game) fields = this.refs.form.getCurrentValues()
        if (fields.game && fields.game !== this.state.game) {
            this.setState({
                game: fields.game
            }, () => {
                this.setList()
            })
        } else {
            this.setState(toObj(fields), this.loadDataFromServer.bind(this))
        }
    }
    loadDataFromServer() {
        let {game, raffle} = this.state
        let url = '/games/winners/get/'
        if (game && raffle) {
            game = this.props.games.filter(el => (el.code === game))[0]._id
            $.ajax({
                url: url,
                data: {game: game, raffle: raffle},
                type: 'GET',
                success: data => {
                    if (data) this.setState({data: data.list, pageNum: Math.ceil(data.meta.total_count / data.meta.limit)})
                },
                error: (xhr, status, err) => {
                    console.error(url, status, err.toString())
                }
            })
        }
    }
    setList() {
        let { accepted, game, raffle } = this.state
        if (this.props.games.length > 0) {
            let list = this.props.games.filter(el => (accepted.indexOf(el.code) !== -1)).map(el => ({code: el.code, name: el.name}))
            if (!game) game = this.props.location.query.game ? this.props.location.query.game : list[0].code
            let current = this.props.games.filter(el => (el.code === game))[0]
            let raffles = []
            current.raffles.map((el, i) => {
                let raffle = [
                    i === 0 ? current.start : current.raffles[i - 1],
                    el
                ]
                raffles.push({
                    name: moment(raffle[0]).format('DD.MM') + ' – ' + moment(raffle[1]).format('DD.MM.YYYY'),
                    code: JSON.stringify(raffle)
                })
            })
            if (!raffle) raffle = this.props.location.query.raffle ? this.props.location.query.raffle : raffles[0].code
            this.setState({
                list: list,
                game: game,
                raffles: raffles,
                raffle: raffle
            }, this.loadDataFromServer.bind(this))
        }
    }
    getHeader() {
        switch (this.state.game) {
        case 'checks':
            return <div className='table__title'>
                <div className='table__col'>ID</div>
                <div className='table__col'>Дата добавления</div>
                <div className='table__col'>Загружен пользователем</div>
                <div className='table__col'>Связанные товары</div>
            </div>
        default:
            return <div className='table__title'>
                <div className='table__col'>Баллов</div>
                <div className='table__col'>Пользователь</div>
                <div className='table__col'>Место в рейтинге</div>
                <div className='table__col'>Установка мест</div>
                <div className='table__col'>Случайный выбор</div>
            </div>
        }
    }
    getRows(data) {
        switch (this.state.game) {
        case 'checks':
            return <div/>
        default:
            return <div/>
        }

    }
    getButtons() {
        switch (this.state.game) {
        case 'checks':
            return <div className='table__buttons'></div>
        default:
            return <div className='table__buttons'></div>
        }
    }
    render() {
        let { game, raffle, list, raffles, data} = this.state
        if (game && raffle) {
            return <div className='admin-competition'>
                <Helmet title='Russell Hobbs | Кабинет модератора | Победители'/>
                <Formsy.Form ref='form' className='form' onChange={this.handleFormChange.bind(this)}>
                    <div className='admin__toolbar'>
                        <Dropdown name='game' className='dropdown--small' items={list} value={game}/>
                        <Dropdown name='raffle' className='dropdown--small' items={raffles} value={raffle}/>
                        {this.getButtons()}
                    </div>
                    <div className={`table admin-competition__table admin-competition__table--${game}`}>
                        {this.getHeader()}
                        {data.length > 0 ? this.getRows(data) : <div className='table__row table__row--message center'>
                            Нет данных за текущий период.
                        </div>}
                    </div>
                </Formsy.Form>
            </div>
        }
        return <Spinner color='#e32c21'/>
    }
}

export default Competition
