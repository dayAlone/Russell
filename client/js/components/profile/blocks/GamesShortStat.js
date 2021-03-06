import React, { Component } from 'react'

import { connect } from 'react-redux'
import * as gamesActions from '../../../actions/games'
import * as profileActions from '../../../actions/profile'
import { bindActionCreators } from 'redux'
import moment from 'moment'
import Coundown from '../../ui/Countdown'

import { Dropdown } from '../../forms/'
import Formsy from 'formsy-react'

@connect(state => ({
    games: state.games.list,
    scores: state.profile.scores,
    checks: state.profile.checks
}), dispatch => ({
    actions: { games: bindActionCreators(gamesActions, dispatch), profile: bindActionCreators(profileActions, dispatch)}}))
class Raring extends Component {
    state = {
        accepted: ['test', 'kitchen', 'checks'],
        stat: [],
        current: 0
    }
    componentDidMount() {
        if (this.props.games.length === 0) this.props.actions.games.getGames()
        if (!this.props.scores) this.props.actions.profile.getScores()
        this.setStat()
    }
    componentDidUpdate() {
        this.setStat()
    }

    setStat() {
        if (this.props.scores && this.props.games.length > 0 && this.state.stat.length === 0) {
            let stat = []

            this.props.games.map(el => {
                console.log(el.code, this.state.accepted.indexOf(el.code))
                if (this.state.accepted.indexOf(el.code) !== -1) {
                    let till
                    el.raffles.sort((a, b) => (moment(b) - moment(a))).map(el => {
                        if (moment(el) > moment()) till = moment(el)
                    })
                    let checks = 0
                    if (el.code === 'checks' && this.props.checks) {
                        this.props.checks.map(c => {
                            if (c.status === 'active' && moment(c.until) > moment()) checks++
                        })
                    }
                    stat.push({
                        name: el.name,
                        code: el.code,
                        till: till,
                        checks: checks,
                        scores: this.props.scores[el.code],
                        today: 20 - (this.props.scores[el.code] ? this.props.scores[el.code].count : 0)
                    })
                }
            })
            this.setState({
                stat: stat
            })
        }
    }
    handleDropdown(el) {
        this.setState({current: el.code})
    }
    render() {
        let current = this.state.stat[this.state.current]
        let last
        if (current) {
            let {name, till, scores, today, checks, code} = current
            last = <div className='table__row'>
                <div className='table__col left'>
                    <Formsy.Form ref='stat-form'>
                        <Dropdown
                            name='current'
                            onChange={this.handleDropdown.bind(this)}
                            value={this.state.current}
                            items={this.state.stat.map((el, i) => {
                                return {
                                    name: el.name,
                                    code: i
                                }
                            })} />
                    </Formsy.Form>
                </div>
                <div className='table__col'>
                    <Coundown till={till}/>
                </div>
                <div className='table__col'>
                    {scores && parseInt(scores.total, 10) === scores.total ? scores.total : <span className='none'>—</span>}
                </div>
                <div className='table__col'>
                    {scores && parseInt(scores.position, 10) === scores.position ? scores.position : <span className='none'>—</span>}
                </div>
                <div className='table__col'>
                    {code !== 'checks' ? <div>{today} / 20</div> : <span className='none'>—</span>}
                </div>
                <div className='table__col'>
                    {code === 'checks' ? <div>{checks}</div> : <span className='none'>—</span>}
                </div>
            </div>
        }
        return <div className='stat stat--short'>
            <div className='table'>
                <div className='table__title'>
                    <div className='table__col left'>Наименование<br/>активности</div>
                    <div className='table__col'>До следующего<br/>розыгрыша</div>
                    <div className='table__col'>Набранные<br/>баллы</div>
                    <div className='table__col'>Позиция<br/>в рейтинге</div>
                    <div className='table__col'>Попытки<br/><nobr>(осталось / всего)</nobr></div>
                    <div className='table__col'>Моих Чеков<br/>в розыгрыше</div>
                </div>
                {this.state.stat.map((el, i) => {
                    let {name, till, scores, today, checks, code} = el
                    return <div className='table__row' key={i}>
                        <div className='table__col left'>
                            <strong>“{name}”</strong>
                        </div>
                        <div className='table__col'>
                            <Coundown till={till}/>
                        </div>
                        <div className='table__col'>
                            {scores && parseInt(scores.total, 10) === scores.total ? scores.total : <span className='none'>—</span>}
                        </div>
                        <div className='table__col'>
                            {scores && parseInt(scores.position, 10) === scores.position ? scores.position : <span className='none'>—</span>}
                        </div>
                        <div className='table__col'>
                            {code !== 'checks' ? <div>{today} / 20</div> : <span className='none'>—</span>}
                        </div>
                        <div className='table__col'>
                            {code === 'checks' ? <div>{checks}</div> : <span className='none'>—</span>}
                        </div>
                    </div>
                })}

                {last}

            </div>
        </div>
    }
}

export default Raring
