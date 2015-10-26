import React, { Component } from 'react'
import moment from 'moment'
import 'moment/locale/ru'

class Coundown extends Component {
    state = {
        dateStart: moment(this.props.dateStart, 'DD.MM.YYYY'),
        dateStop: moment(this.props.dateStop, 'DD.MM.YYYY'),
        current: new Date(),
        timeout: false
    }
    calculate() {
        let values = []
        let lang = {
            seconds: ['секунда', 'секунды', 'секунд', 'секунды'],
            minutes: ['минута', 'минуты', 'минут', 'минуты'],
            hours: ['час', 'часа', 'часов', 'часа'],
            days: ['день', 'дня', 'дней', 'дня'],
            month: ['месяц', 'месяца', 'месяцев', 'месяца']
        }
        let types = ['month', 'days', 'hours', 'minutes', 'seconds']
        let secondsCounts = [2592000, 86400, 3600, 60, 1]
        let remains = this.state.dateStart.unix() - moment().unix()
        for (let i = 0, l = secondsCounts.length; i < l; i++) {
            let currentSecondsCount = secondsCounts[i]
            let currentValue = Math.floor(remains / currentSecondsCount)
            remains = remains - currentValue * currentSecondsCount
            values.push(currentValue)
        }

        return values.map((el, i) => {
            return [el, this.pluralize(el, lang[types[i]])]
        }).filter(el => {
            return el[0] > 0
        })
    }
    pluralize(number, lang) {
        let { 0: one, 1: few, 2: many, 3: other } = lang
        let _ref, _ref1, _ref2, _ref3

        if (other === null) {
            other = few
        }
        if ((number % 10) === 1 && number % 100 !== 11) {
            return one
        }
        if (((_ref = number % 10) === 2 || _ref === 3 || _ref === 4) && !((_ref1 = number % 100) === 12 || _ref1 === 13 || _ref1 === 14)) {
            return few
        }
        if ((number % 10) === 0 || ((_ref2 = number % 10) === 5 || _ref2 === 6 || _ref2 === 7 || _ref2 === 8 || _ref2 === 9) || ((_ref3 = number % 100) === 11 || _ref3 === 12 || _ref3 === 13 || _ref3 === 14)) {
            return many
        }
        return other

    }
    getCounter() {
        return this.calculate().map((el, i) => {
            return <div className='countdown__item' key={i}>
                <strong>{el[0]}</strong><span>{el[1]}</span>
            </div>
        })
    }
    componentDidMount() {
        this.setState({ timeout: setInterval(() => {
            this.tick()
        }, 1000)})
    }
    componentWillUnmount() {
        clearInterval(this.state.timeout)
    }
    tick() {
        let { dateStop, current } = this.state
        if (dateStop.toDate() > current) {
            this.setState({current: new Date()})
        } else {
            clearInterval(this.state.timeout)
        }

    }
    render() {
        let { dateStart, dateStop, current } = this.state
        const counter = this.getCounter()
        return <div className='countdown'>
            <div className='countdown__info'>C {dateStart.format('D MMMM')}<br/> по {dateStop.format('D MMMM')}</div>
            {!this.props.hideButton ? <div className='countdown__divider' /> : false}
            {
                dateStart.toDate() < current ?
                ( !this.props.hideButton ? <a href={this.props.link} className='countdown__button'>Участвовать</a> : false)
                : <div className='countdown__frame'><div className='countdown__till'>До начала <br/>акции</div>{counter}</div>
            }
        </div>
    }
}

export default Coundown
