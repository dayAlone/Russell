import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import Spinner from '../ui/Spinner'
import moment from 'moment'
import 'moment/locale/ru'

import Slick from 'react-slick'

import * as actionCreators from '../../actions/games'
import { bindActionCreators } from 'redux'

@connect(state => ({ game: state.games.list[0] }), dispatch => ({actions: bindActionCreators(actionCreators, dispatch)}))
class Title extends Component {
    static defaultProps = { type: 'small' }
    componentDidMount() {
        if (!this.props.game) {
            this.props.actions.getGames()
        }
    }
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1))
            let temp = array[i]
            array[i] = array[j]
            array[j] = temp
        }
        return array
    }
    handleClick() {
        if (window.yaCounter33079538) window.yaCounter33079538.reachGoal('participate')
    }
    render() {
        if (this.props.game) {
            let content = []
            let { start: dateStart, end: dateStop, description } = this.props.game
            let start = moment(dateStart).format('D MMMM')
            let end = moment(dateStop).format('D MMMM')
            description = description.replace('#start#', start).replace('#end#', end)
            for (let i = 1; i < 12; i++) {
                content.push(<Link key={i} to='/games/'><img src={`/layout/images/b-${i}.jpg`} alt='' /></Link>)
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
                <Slick className='title__slider' {...options}>{this.shuffleArray(content)}</Slick>
                

                <img src={`/layout/images/line.png`} width='100%' className='title__line' height='2'/>
            </div>
        }
        return <Spinner />
    }
}

export default Title
