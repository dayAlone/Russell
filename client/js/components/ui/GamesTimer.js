import React, { Component } from 'react'
import moment from 'moment'
import 'moment/locale/ru'
import Countdown from './Countdown'
import { Link } from 'react-router'

class GamesTimer extends Component {
    render() {
        let {dateStart, dateStop, raffles} = this.props
        dateStart = moment(dateStart)
        dateStop = moment(dateStop)
        let till = dateStart
        if (dateStart < moment()) {
            raffles = raffles.sort((a, b) => (moment(b) - moment(a))).map(el => {
                if (moment(el) > moment()) till = moment(el)
                return moment(el)
            })

        }
        console.log(this.props.link)
        return <div className='countdown'>
            <div className='countdown__info'>C {dateStart.format('D MMMM')}<br/> по {dateStop.format('D MMMM')}</div>
            <div className='countdown__frame'>
                <div className='countdown__till'>
                    { dateStart === till ? <span>До начала <br/>акции</span> : <span>До очередного <br/>розыгрыша</span> }

                </div>
                <Countdown till={till}/>
            </div>
            <Link to={this.props.link} className='countdown__button'>Участвовать</Link>

        </div>
    }
}
export default GamesTimer

/*{!this.props.hideButton ? <div className='countdown__divider' /> : false}
{
    till.toDate() < current ?
    ( !this.props.hideButton ? <a href={this.props.link} className='countdown__button'>Участвовать</a> : false)
    : <div className='countdown__frame'><div className='countdown__till'>До начала <br/>акции</div></div>
}*/
