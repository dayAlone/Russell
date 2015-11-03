import React, { Component } from 'react'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actionCreators from '../../../actions/profile'

import moment from 'moment'

@connect(state => ({checks: state.profile.checks}), dispatch => ({actions: bindActionCreators(actionCreators, dispatch)}))
class ChecksStat extends Component {
    componentDidMount() {
        if (this.props.checks.length === 0) {
            this.props.actions.getChecks()
        }
    }
    render() {
        if (this.props.checks.length > 0) {
            let stat = {
                favorites: 0,
                count: 0,
                total: this.props.checks.length,
                active: 0,
                moderation: 0,
                gameover: 0
            }
            this.props.checks.map(el => {
                stat.favorites += el.products.length
                stat.count += el.count - el.products.length
                if (el.status === 'active') stat.active++
                else if (moment(el.until) < moment()) stat.gameover++
                else if (el.status !== 'canceled') stat.moderation++
            })
            return <div className='checks-stat'>
                <div className='profile__col'>
                    Товаров в избранном: {stat.favorites} <br/>
                    Доступно для добавления: {stat.count}
                    </div>
                <div className='profile__col'>
                    Всего чеков: {stat.total}<br/>
                    Активных чеков: {stat.active}<br/>
                    Чеков на модерации: {stat.moderation}<br/>
                    Сыгранных чеков: {stat.gameover}
                </div>
            </div>
        }
        return <div/>


    }
}
export default ChecksStat
