import React, { Component } from 'react'
import moment from 'moment'
import 'moment/locale/ru'
import Countdown from './Countdown'
import { Link } from 'react-router'

class GamesTimer extends Component {
    render() {
        let {dateStart, dateStop, raffles, link, rating, code} = this.props
        dateStart = moment(dateStart)
        dateStop = moment(dateStop)
        let till = dateStart
        if (dateStart < moment()) {
            raffles = raffles.sort((a, b) => (moment(b) - moment(a))).map(el => {
                if (moment(el) > moment()) till = moment(el)
                return moment(el)
            })
        }
        return <div className='countdown'>
            <div className='countdown__info'>C {dateStart.format('D MMMM')}<br/> по {dateStop.format('D MMMM')}</div>
            <div className='countdown__frame'>
                <div className='countdown__till'>
                    { dateStart === till ? <span>До начала <br/>акции</span> : <span>До {code !== 'present' ? 'очередного' : null }<br/>розыгрыша</span> }

                </div>
                <Countdown till={till}/>
            </div>
            { dateStart !== till ? <Link to={link} className='countdown__button'>Участвовать</Link> : null }<br/>
            { dateStart !== till && code !== 'present' ? <Link to={rating} className='countdown__rating'>Рейтинг игроков ближайшего розыгрыша</Link> : null }
        </div>
    }
}
export default GamesTimer
