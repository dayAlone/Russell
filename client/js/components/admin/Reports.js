import React, { Component } from 'react'
import Helmet from 'react-helmet'

import { connect } from 'react-redux'
import Formsy from 'formsy-react'
import { Dropdown, RadioGroup, Input } from '../forms/'

import * as actionCreators from '../../actions/games'
import { bindActionCreators } from 'redux'

import moment from 'moment'

@connect(state => ({ games: state.games.list }), dispatch => ({actions: bindActionCreators(actionCreators, dispatch)}))
class Reports extends Component {
    state = {
        accepted: ['checks', 'kitchen', 'test', 'present'],
        list: []
    }
    componentDidMount() {
        if (this.props.games.length === 0) this.props.actions.getGames()
        this.setList()
    }
    componentDidUpdate(prevProps) {
        if (this.props.games.length > 0 && prevProps.games.length === 0) this.setList()
    }
    setList() {
        let { accepted } = this.state
        if (this.props.games.length > 0) {
            let list = this.props.games
                .filter(el => (accepted.indexOf(el.code) !== -1))
                .map(game => {
                    let raffles = []
                    game.raffles.map((el, i) => {
                        let raffle = [
                            i === 0 ? game.start : game.raffles[i - 1],
                            el
                        ]
                        raffles.push({
                            name: moment(raffle[0]).format('DD.MM') + ' – ' + moment(raffle[1]).format('DD.MM.YYYY'),
                            code: JSON.stringify(raffle)
                        })
                    })

                    return {
                        name: game.name,
                        raffles: raffles,
                        _id: game._id,
                        code: game.code
                    }
                })
            this.setState({ list: list })
        }
    }
    onSubmit(fields) {
        let params = 'menubar=yes, location=yes, resizable=yes, scrollbars=yes, status=yes'
        fields.raffle = JSON.parse(fields.raffle)
        window.open('/admin/get-report/?fields=' + JSON.stringify(fields), 'Report', params)
    }
    render() {
        return <div className='admin__reports'>
            <Helmet title='Russell Hobbs | Кабинет модератора | Отчеты'/>
            <div className='table table--reports'>
                <div className='table__row form'>
                    <div className='table__col'>Пользователи</div>
                    <div className='table__col'></div>
                    <div className='table__col right'>
                        <a href='/admin/users/get-csv/' target='_blank' className='button button--small'>Скачать отчет</a>
                    </div>
                </div>
                {this.state.list.map((el, i) => {
                    let { name } = el
                    return <div className='table__row form' key={i}>
                        <Formsy.Form onSubmit={this.onSubmit.bind(this)}>
                            <Input name='id' type='hidden' value={el._id} />
                            <Input name='code' type='hidden' value={el.code} />
                            <div className='table__col'>{name}</div>
                            <div className='table__col'>
                                {el.raffles.length > 1 ? <Dropdown name='raffle' className='dropdown--small' items={el.raffles} value={el.raffles[0].code}/> : <Input name='raffle' type='hidden' value={el.raffles[0].code} />}
                            </div>
                            <div className='table__col right'>
                                <button type='submit' className='button button--small'>Скачать отчет</button>
                            </div>
                        </Formsy.Form>
                    </div>
                })}

            </div>
        </div>
    }

}
export default Reports
