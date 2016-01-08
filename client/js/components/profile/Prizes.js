import React, { Component } from 'react'
import { Link } from 'react-router'
import Helmet from 'react-helmet'
import { bindActionCreators } from 'redux'
import * as actionCreators from '../../actions/profile'
import { connect } from 'react-redux'

import { Dropdown } from '../forms/'
import Formsy from 'formsy-react'

import moment from 'moment'

class Prize extends Component {
    render() {
        let {current, handleDropdown, el, list} = this.props
        let { prize, game, raffle } = el
        let fields = {
            subject: encodeURIComponent('Получение выигрыша'),
            message: encodeURIComponent(`Здравствуйте. \nМеню зовут ${this.props.user.displayName}, я выиграл ${prize.name} в конкурсе ${game ? game.name : null} от ${moment(raffle).format('DD.MM.YYYY')}. \nЧто мне необходимо сделать, чтобы получить выигрыш?`)
        }
        return <div className='table__row'>
            <div className='table__col left'>
                <img src={prize.photo} width='70' alt='' />
                {list ? <Formsy.Form ref='check-select'>
                    <Dropdown
                        name='current'
                        onChange={handleDropdown}
                        value={current}
                        items={list} />
                    </Formsy.Form> : <span>{prize.name}</span> }
            </div>
            <div className='table__col'>{moment(raffle).format('DD.MM.YYYY')}</div>
            <div className='table__col'>{game ? game.name : null}</div>
            <div className='table__col right'>
                
            </div>
        </div>
    }
}

@connect(state => ({prizes: state.profile.prizes, user: state.login.data}), dispatch => ({actions: bindActionCreators(actionCreators, dispatch)}))
class ProfilePrizes extends Component {
    state = { current: 0 }
    componentDidMount() {
        if (this.props.prizes.length === 0) {
            this.props.actions.getPrizes()
        }
    }
    handleDropdown(el) {
        this.setState({current: el.code})
    }
    render() {
        let { prizes, user } = this.props
        let last
        if (prizes.length > 0) {
            prizes = prizes.filter(el => (el.prize))
            last = <Prize
                current={this.state.current}
                el={prizes[0]}
                user={user}
                handleDropdown={this.handleDropdown.bind(this)}
                list={prizes.map((el, i) => {
                    return {
                        name: `${el.prize.name}`,
                        code: i
                    }
                })}/>
        }
        return <div className={`prizes prizes--${prizes.length}`}>
            <Helmet title='Russell Hobbs | Личный кабинет | Призы'/>
            <div className='table prizes__table'>
                <div className='table__title'>
                    <div className='table__col left'>Выигрыш</div>
                    <div className='table__col'>Дата выигрыша</div>
                    <div className='table__col'>Активность</div>
                    <div className='table__col'></div>
                </div>
                {prizes.length === 0 ?
                    <div className='table__row table__row--message center'>
                        У вас нет ни одно приза.
                    </div>
                : prizes.map((el, i) => (<Prize el={el} key={i} user={user}/>))}
                {last}
            </div>

        </div>
    }
}

export default ProfilePrizes
