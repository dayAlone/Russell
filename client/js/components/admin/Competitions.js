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
        perPage: 10,
        offset: 0,
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
    handleFormChange(fields, e) {
        if (fields.game !== this.state.game) {
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

        let {perPage, offset, game, raffle} = this.state
        let url
        switch (game) {
        case 'checks':
            url = '/admin/checks/get/'
            break
        default:
            url = '/games/rating/get/'
            break
        }
        if (game && raffle) {
            $.ajax({
                url: url,
                data: {limit: perPage, offset: offset, game: game, raffle: raffle},
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
            if (!game) game = list[0].code
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
            if (!raffle) raffle = raffles[0].code
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
    getRow(type, el, i) {
        switch (type) {
        case 'checks':
            let {_id, added, user, products} = el
            let name = user ? user.displayName : null
            if (typeof _id !== 'object') {
                return <div className='table__row' key={i}>
                    <div className='table__col'>{_id}</div>
                    <div className='table__col'>{moment(added).format('DD.MM.YYYY HH:mm')}</div>
                    <div className='table__col'>{name}</div>
                    <div className='table__col'>{products.length > 0 ?
                        products.map((el, i) => {
                            return <div key={i}><a href={`/catalog/product/${el.product.code}/`} target='_blank'>{el.product.name}</a><br/><br/></div>
                        })
                        : 'нет'}</div>
                </div>
            }
            return null
        default:
            let {total, _id: profile} = el
            let id = profile._id
            return <div className='table__row' key={i}>
                <div className='table__col'>{total}</div>
                <div className='table__col'>{profile.displayName}</div>
                <div className='table__col'>{parseInt(this.state.offset, 10) + i + 1}</div>
                <div className='table__col'>
                    <RadioGroup name={'place[1]'} items={[{name: '1', code: id}]} />
                    <RadioGroup name={'place[2]'} items={[{name: '2', code: id}]} />
                    <RadioGroup name={'place[3]'} items={[{name: '3', code: id}]} />
                </div>
                <div className='table__col'>Случайный выбор</div>
            </div>
        }

    }
    render() {
        let { game, raffle, list, raffles, data } = this.state
        if (game && raffle) {

            return <div className='admin-competition'>
                <Helmet title='Russell Hobbs | Кабинет модератора | Розыгрыш'/>
                <Formsy.Form ref='form' className='form' onChange={this.handleFormChange.bind(this)}>
                    <div className='admin__toolbar'>
                        <Dropdown name='game' className='dropdown--small' items={list} value={game}/>
                        <Dropdown name='raffle' className='dropdown--small' items={raffles} value={raffle}/>
                    </div>
                    <div className={`table admin-competition__table admin-competition__table--${game}`}>
                        {this.getHeader()}
                        {data.length > 0 ? data.map((el, i) => (this.getRow(game, el, i))) : <div className='table__row table__row--message center'>
                            Нет данных за текущий период.
                        </div>}
                    </div>
                    <div className='admin__footer'>
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
                        <RadioGroup name='limit' title='Показывать по:' items={[
                            {name: '10', code: 10},
                            {name: '50', code: 50},
                            {name: '100', code: 100},
                        ]} value='10'/>
                    </div>
                </Formsy.Form>
            </div>
        }
        return <Spinner color='#e32c21'/>
    }
}

export default Competition
