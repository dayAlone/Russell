import React, { Component } from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import moment from 'moment'
import 'moment/locale/ru'
import Spinner from '../ui/Spinner'
import Title from '../layout/Title'
import Countdown from '../ui/GamesTimer'

@connect(state => ({ games: state.games.list }))
class PageGames extends Component {

    render() {
        const games = this.props.games.map((el, i) => {

            let { name, code, description, start: dateStart, end: dateStop, image, link, flag, raffles } = el
            let start = moment(dateStart).format('D MMMM')
            let end = moment(dateStop).format('D MMMM')
            description = description.replace('#start#', start).replace('#end#', end)

            if (i > 0) {
                return <div key={i} className='game'>
                    <div className='game__image'>
                        <div className='game__flag'>{flag}</div>
                        <img src={image} alt='' />
                    </div>
                    <div className='game__content'>
                        <h2 className='game__title'>{name}</h2>
                        <div className='game__description' dangerouslySetInnerHTML={{__html: description}} />
                        <Countdown
                            link={`/games/${code}/`}
                            raffles={raffles}
                            dateStart={dateStart.toString()}
                            dateStop={dateStop.toString()}
                            />
                    </div>
                    { i + 1 !== this.props.games.length ? <img src='/layout/images/line.png' width='100%' className='game__line' /> : null }
                </div>
            }
        })
        return <div className='page page--games'>
            <Helmet title={'Russell Hobbs | Выиграй мечту!'}/>
            <Title type='counter' />
            {games.length > 0 ? <div className='games'>{games}</div> : <Spinner />}
        </div>
    }
}

export default PageGames
