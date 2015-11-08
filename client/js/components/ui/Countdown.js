import React, { Component } from 'react'
import moment from 'moment'
import 'moment/locale/ru'
import pluralize from '../../libs/pluralize'
class Coundown extends Component {
    state = {
        till: moment(this.props.till),
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
        let remains = this.state.till.unix() - moment().unix()
        for (let i = 0, l = secondsCounts.length; i < l; i++) {
            let currentSecondsCount = secondsCounts[i]
            let currentValue = Math.floor(remains / currentSecondsCount)
            remains = remains - currentValue * currentSecondsCount
            values.push(currentValue)
        }

        return values.map((el, i) => {
            return [el, pluralize(el, lang[types[i]])]
        }).filter(el => {
            return el[0] > 0
        })
    }

    getCounter() {
        return this.calculate().map((el, i) => {
            return <div className='countdown__item' key={i}>
                <strong>{el[0]}</strong><span>{el[1]}</span>
            </div>
        })
    }
    componentDidMount() {
        this.setState({ timeout: setInterval(this.tick.bind(this), 1000)})
    }
    componentWillUnmount() {
        clearInterval(this.state.timeout)
    }
    tick() {
        let { till, current } = this.state
        if (till.toDate() > current) {
            this.setState({current: new Date()})
        } else {
            clearInterval(this.state.timeout)
        }

    }
    render() {
        const counter = this.getCounter()
        return <div className='countdown__items'>{counter}</div>
    }
}

export default Coundown
