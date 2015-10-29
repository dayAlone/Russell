import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import Spinner from '../ui/Spinner'
import moment from 'moment'
import 'moment/locale/ru'

import Countdown from '../ui/Countdown'

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
    render() {
        if (this.props.game) {
            let content = ''
            let { image, start: dateStart, end: dateStop, description, link, flag } = this.props.game
            let start = moment(dateStart).format('D MMMM')
            let end = moment(dateStop).format('D MMMM')
            description = description.replace('#start#', start).replace('#end#', end)
            
            switch (this.props.type) {
            case 'counter':
            case 'big':
                content = <div>
                    <div className='title__image'>
                        {this.props.type === 'counter' ? <div className='title__flag'>{flag}</div> : false}
                        <img src={`/layout/images/header.jpg`} width='100%' />
                    </div>
                    <div className='title__products'><img src={image} /></div>
                    <div className='title__question'>Вы мечтаете о стильной технике для кухни?</div>
                    <div className='title__divider'></div>
                    <div className='title__description'>
                        <p dangerouslySetInnerHTML={{__html: description}} />
                    </div>
                    {this.props.type === 'counter' ? <div className='title__counter'>
                        <Countdown dateStart={dateStart} dateStop={dateStop} link={link} hideButton={true}/>
                    </div> : false}
                    <div className='title__actions'>
                        {this.props.type !== 'counter' ? <Link to='/games/' className='button button--big'>Выиграть!</Link> : false }
                    </div>
                </div>
                break
            default:
                content = <Link to='/games/'><img src={`/layout/images/header-small.jpg`} width='100%' className='title__image' /></Link>
            }
            return <div className={`title ${this.props.type ? `title--${this.props.type}` : ''}`}>
                <img src={`/layout/images/svg/love.svg`} height='29' className='title__love' />
                {content}
                <img src={`/layout/images/line.png`} width='100%' className='title__line' height='2'/>
            </div>
        }
        return <Spinner />
    }
}

export default Title
