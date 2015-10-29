import React, { Component } from 'react'
import { Link } from 'react-router'
import Helmet from 'react-helmet'
import { bindActionCreators } from 'redux'
import * as actionCreators from '../../actions/profile'
import { connect } from 'react-redux'

import moment from 'moment'

class Check extends Component {
    state = {hidden: true}
    handleClick(e) {
        this.setState({hidden: !this.state.hidden})

        e.preventDefault()
    }
    render() {
        let {_id, organisation, inn, eklz, date, time, total, kpk_number, kpk_value, photo, status, status_comment, count, vinner, products, until, created} = this.props.data
        let available = count - products.length
        let condition
        switch (status) {
        case 'canceled':
            condition = {
                message: 'Отклонен',
                class: 'canceled'
            }
            break
        case 'active':
            condition = {
                message: 'Активен',
                class: 'active'
            }
            break
        default:
            condition = {
                message: 'На модерации',
                class: 'moderation'
            }
        }
        if (moment(until) < moment()) {
            condition = {
                message: 'Сыгран',
                class: 'inactive'
            }
        }
        return <div className='table__row check'>
            <div className='table__col left'>
                <span>ID: {_id}</span><br/>
                <div className={`check__info ${!this.state.hidden ? 'check__info--visible' : ''}`}>
                    <span>Организация: {organisation}</span><br/>
                    <span>ИНН: {inn}</span><br/>
                    <span>ЭКЛЗ: {eklz}</span><br/>
                    <span>Дата: {date}</span><br/>
                    <span>Время: {time}</span><br/>
                    <span>Сумма: {total}</span><br/>
                    <span>Номер КПК: {kpk_number}</span><br/>
                    <span>Значение КПК: {kpk_value}</span><br/>
                    <div className='check__preview'>{photo}</div>
                </div>
                <a href='#' className='check__show' onClick={this.handleClick.bind(this)}>{!this.state.hidden ? 'Скрыть' : 'Показать'} детали</a>
            </div>
            <div className='table__col' dangerouslySetInnerHTML={{__html: moment(created).format('DD.MM.YYYY<br/>HH:mm')}} />
            <div className='table__col left'>
                <div className={`check__status check__status--${condition.class}`}>{condition.message}</div>
                {status_comment ? <div className='check__comment' data-text={status_comment}>?</div> : null}
            </div>
            <div className='table__col'>
                {products.length > 0 ?
                    products.map((el, i) => {
                        return <Link to={`/catalog/product/${el.code}/`} key={i}>{el.name}</Link>
                    })
                    : 'нет'}
            </div>
            <div className='table__col'>
                {available}
                <br />
                {available > 0 ? <Link to='/catalog/' className='check__connect'>связать</Link> : null}
            </div>
            <div className='table__col'>{moment(until).format('DD.MM.YYYY')}</div>
            <div className='table__col'>{vinner ? <Link to='/profile/prizes/' className='check__vinner'>Да</Link> : null}</div>
        </div>
    }
}

@connect(state => ({checks: state.profile.checks}), dispatch => ({actions: bindActionCreators(actionCreators, dispatch)}))
class ProfileChecks extends Component {
    componentDidMount() {
        if (this.props.checks.length === 0) {
            this.props.actions.getChecks()
        }
    }
    render() {
        let checks = this.props.checks.map((el, i) => (<Check key={i} data={el}/>))
        return <div className='checks'>
            <Helmet title='Russell Hobbs | Личный кабинет | Чеки'/>
            <div className='table checks__table'>
                <div className='table__title'>
                    <div className='table__col'>Данные<br/> чека</div>
                    <div className='table__col'>Дата<br/> добавления</div>
                    <div className='table__col left'>Статус<br/> чека</div>
                    <div className='table__col'>Связанные<br/> товары</div>
                    <div className='table__col'>Доступно<br/> для связки</div>
                    <div className='table__col'>Дата<br/> розыгрыша</div>
                    <div className='table__col'>Выигрыш<br/> чека</div>
                </div>
                {this.props.checks.length === 0 ?
                    <div className='table__row table__row--message center'>
                        У вас нет ни одно чека.
                    </div>
                : checks}
            </div>

        </div>
    }
}

export default ProfileChecks
