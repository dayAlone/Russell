import React, { Component } from 'react'
import Helmet from 'react-helmet'
import ReactDOM from 'react-dom'
import ReactPaginate from 'react-paginate'
import { connect } from 'react-redux'

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
        url: '/admin/checks/get/',
        list: false,
        raffles: false
    }
    componentDidMount() {
        if (this.props.games.length === 0) this.props.actions.getGames()
    }
    componentDidUpdate(prevProps) {
        console.log(this.state.game)
        if (this.props.games.length > 0 && (prevProps.games.length === 0 || !this.state.game)) {
            this.setList()
        }
    }
    handleFormChange(fields) {
        if (fields.game !== this.state.game) {
            this.setState({
                game: fields.game,
                raffle: false
            }, this.loadDataFromServer.bind(this))
        } else this.setState(fields, this.loadDataFromServer.bind(this))
    }
    loadDataFromServer() {
        let {game, raffle} = this.state
        if (game && raffle) {
            console.log(this.state)
        }
    }
    setList() {
        let { accepted, game, raffle } = this.state
        if (this.props.games.length > 0) {
            let list = this.props.games.filter(el => (accepted.indexOf(el.code) !== -1)).map(el => ({code: el._id, name: el.name}))
            if (!game) game = list[0].code
            let raffles = this.props.games.filter(el => (el._id === game))[0].raffles.map(el => ({code: el, name: moment(el).format('DD.MM.YYYY')}))
            if (!raffle) raffle = raffles[0].code
            this.setState({
                list: list,
                game: game,
                raffles: raffles,
                raffle: raffle
            }, this.loadDataFromServer.bind(this))
        }
    }
    render() {
        let { game, raffle, list, raffles } = this.state
        console.log(game, raffle)
        if (game && raffle) {

            return <div className='admin-competition'>
                <Helmet title='Russell Hobbs | Кабинет модератора | Розыгрыш'/>
                <Formsy.Form ref='form' className='form' onChange={this.handleFormChange.bind(this)}>
                    <div className='admin__toolbar'>
                        <Dropdown name='game' className='dropdown--small' items={list} value={game}/>
                        <Dropdown name='raffle' className='dropdown--small' items={raffles} value={raffle}/>
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
