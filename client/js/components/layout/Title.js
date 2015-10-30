import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import moment from 'moment'
import 'moment/locale/ru'

import Countdown from '../ui/Countdown'
import Slick from 'react-slick'

@connect(state => ({ game: state.games.list[0] }))
class Title extends Component {
    static defaultProps = { type: 'small' }
    render() {
        let content = []
        let { image, dateStart, dateStop, description, link, flag } = this.props.game
        let start = moment(dateStart, 'DD.MM.YYYY').format('D MMMM')
        let end = moment(dateStop, 'DD.MM.YYYY').format('D MMMM')
        description = description.replace('#start#', start).replace('#end#', end)

        for (let i = 1; i < 12; i++) {
            content.push(<Link to='/games/'><img key={i} src={`/layout/images/b-${i}.jpg`} alt='' /></Link>)
        }
        let options = {
            arrows: false,
            infinite: true,
            autoplay: true,
            autoplaySpeed: 3000,
            fade: true,
            speed: 2000,
            swipe: false
        }
        return <div className={`title ${this.props.type ? `title--${this.props.type}` : ''}`}>
            <img src={`/layout/images/svg/love.svg`} height='23' className='title__love' />
            <Slick className='title__slider' {...options}>{content}</Slick>
            {this.props.type === 'big' || this.props.type === 'counter' ?
                <div>
                    <div className='title__group'>
                        <div className='title__col'>
                            <span className='title__number'>1</span>
                            <p>Приобретайте технику Russell Hobbs с 12 октября по 30 декабря</p>
                        </div>
                        <div className='title__col'>
                            <span className='title__number'>2</span>
                            <p>Регистриуйте на сайте чеки за покупку, выбирайте призы</p>
                        </div>
                        <div className='title__col'>
                            <span className='title__number'>3</span>
                            <p>Выигрывайте свои призы или главный приз</p>
                        </div>
                    </div>
                    <div className='title__col'>
                        <Link to='/games/' className='button'>Выиграть!</Link>
                    </div>
                </div>
                : null}

            <img src={`/layout/images/line.png`} width='100%' className='title__line' height='2'/>
        </div>
    }
}

export default Title
