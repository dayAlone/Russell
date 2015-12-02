import React, { Component } from 'react'
import Countdown from '../ui/Countdown'


import { Dropdown } from '../forms/'
import Formsy from 'formsy-react'

import { connect } from 'react-redux'
import * as actionCreators from '../../actions/games'
import { bindActionCreators } from 'redux'
import moment from 'moment'

@connect(state => ({ games: state.games.list }), dispatch => ({actions: bindActionCreators(actionCreators, dispatch)}))
class ProfileStatistic extends Component {
    state = {
        accept: ['test', 'kitchen', 'checks']
    }
    componentDidMount() {
        if (this.props.games.length === 0) {
            this.props.actions.getGames()
        }
    }
    handleDropdown() {

    }
    render() {
        let games = this.props.games.filter(el => (this.state.accept.indexOf(el.code) !== -1)).map(el => ({code: el.code, name: el.name, raffles: el.raffles}))
        let raffle
        let game = this.props.games.sort((el, i) => (this.state.current && el.code === this.state.current || i === 0))[0]
        console.log(game)
        games.map((el, i) => {
            if (this.state.current && el.code === this.state.current || i === 0) {
                el.raffles.sort((a, b) => (moment(b) - moment(a))).map(r => {
                    if (moment() < moment(r)) raffle = r
                })
            }
        })
        return <div>{ raffle ? <div className='stat'>
            <div className='stat__toolbar'>
                <div className='stat__col'>
                    <Formsy.Form ref='check-select'>
                        <Dropdown
                            name='current'
                            onChange={this.handleDropdown}
                            value={this.state.current ? this.state.current : game.code}
                            items={games} />
                    </Formsy.Form>
                </div>
                <div className='stat__col right'>
                    <div className='countdown__till'><span>До очередного<br/>розыгрыша</span></div>
                    <Countdown till={raffle}/>
                </div>
            </div>
            <div className={`table table--${game.code}`}>
                <div className='table__title'>
                    <div className='table__col'>Дата<br/> розыгрыша</div>
                    <div className='table__col'>Набранные очки<br/> к текущему розыгрышу</div>
                    <div className='table__col'>Позиция<br/> в рейтинге</div>
                    <div className='table__col'>Попытки<br/> (осталось / всего)</div>
                    <div className='table__col'>Очков<br/> за шеринг</div>
                    <div className='table__col'>Последняя<br/> игра</div>
                </div>
            </div>
        </div> : null }</div>
    }
}

export default ProfileStatistic
