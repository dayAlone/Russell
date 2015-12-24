import React, { Component } from 'react'
import Helmet from 'react-helmet'
import ReactDOM from 'react-dom'
import ReactPaginate from 'react-paginate'

import Formsy from 'formsy-react'
import { Dropdown } from '../forms/'
import { connect } from 'react-redux'
import * as actionCreators from '../../actions/games'
import { bindActionCreators } from 'redux'
import moment from 'moment'
import pluralize from '../../libs/pluralize'

@connect(state => ({ games: state.games.list, prizes: state.games.prizes }), dispatch => ({actions: bindActionCreators(actionCreators, dispatch)}))
class Winners extends Component {
    state = {
        data: [],
        url: '/games/winners/get/',
        game: this.props.location.query.game ? this.props.location.query.game : 'checks',
        accepted: ['test', 'kitchen', 'share-history', 'maraphon', 'heart', 'present', 'checks'],
        games: [],
        raffle: false,
    }
    loadRatingFromServer() {
        let {url} = this.state
        let {game, raffle} = this.refs.form_top.getCurrentValues()
        game = this.props.games.filter(el => (el.code === game))[0]._id
        $.ajax({
            url: url,
            data: {game: game, raffle: raffle},
            type: 'GET',
            success: data => {
                if (data) this.setState({data: data.list})
            },
            error: (xhr, status, err) => {
                console.error(url, status, err.toString())
            }
        })
    }
    componentDidMount() {
        this.getGamesList()
        if (this.props.games.length === 0) this.props.actions.getGames()
        if (this.props.prizes.length === 0) this.props.actions.getPrizes()

    }
    handlePageClick(data) {
        let selected = data.selected
        let offset = Math.ceil(selected * this.state.limit)

        this.setState({offset: offset, currentPage: selected}, () => {
            this.loadRatingFromServer()
        })
    }
    handleTopFormChange() {
        let values = this.refs.form_top.getCurrentValues()
        let changes = false;
        ['game', 'raffle'].map(el => {
            if (values[el] !== this.state[el]) {
                changes = true
            }
        })

        if (changes) {
            let { game, raffle } = values
            this.setState({
                game: game,
                raffle: raffle,
                data: []
            }, () => {
                this.loadRatingFromServer()
            })
        }
    }
    getGamesList() {
        if (this.state.games.length === 0 && this.props.games.length > 0) {
            let games = []
            this.props.games.map(el => {
                if (this.state.accepted.indexOf(el.code) !== -1) {
                    let list = [el.start].concat(el.raffles)
                    list = list.sort((a, b) => (moment(a) - moment(b)))
                    let raffles = []
                    list.map((r, i) => {
                        if (list[i + 1] && moment(list[i + 1]) < moment()) {
                            raffles.push([r, list[i + 1]])
                        }
                    })
                    if (raffles.length !== 0) {
                        games.push({
                            name: el.name,
                            code: el.code,
                            raffles: raffles,
                            video: el.video
                        })
                    }
                }
            })
            if (games.length > 0) {
                this.setState({
                    games: games
                }, this.loadRatingFromServer)
            }

        }
    }
    componentDidUpdate(prevProps, prevState) {
        this.getGamesList()
        if (prevState.game !== this.state.game) this.setState({ raffle: false })
    }
    getByLink(link) {
        let matches
        let network = ''
        if (link) {
            matches = link.match(/:\/\/(?:www\.)?(.[^/]+)(.*)/)
            if (matches) {
                switch (matches[1]) {
                case 'vk.com':
                    network = 'Вконтакте'
                    break
                case 'instagram.com':
                    network = 'Instagram'
                    break
                default:
                    network = 'Facebook'
                }
            }

        }
        return network
    }
    getRusults() {
        let { data, game, games, raffle } = this.state
        switch (game) {
        case 'checks':
            let tmp = raffle ? JSON.parse(raffle) : false
            let cur = games.filter(el=>(el.code === game))[0]
            let curKey = cur.raffles.map(el=>(el[1])).indexOf(tmp[1])
            let video = cur.video ? cur.video[curKey !== -1 ? curKey : 0] : false
            console.log(cur.video, curKey)
            let view = (el, i) => {
                let { position, user, additional, prize } = el
                if (user) {
                    let { photo, displayName } = user
                    let { check } = additional

                    return <div className={`winners__item winners__item--${position} ${position > 0 ? 'winners__item--small' : ''}`} key={i}>
                        <div className='winners__photo' style={{backgroundImage: `url(${photo ? photo : '/layout/images/svg/avatar.svg'})`}}/>
                        <div className='winners__content'>
                            <div className='winners__name'>{displayName}</div>
                            <small>ID чека: {check._id}</small>
                            {prize && prize.photo ? <div className='winners__prize'>
                                <img src={prize.photo} alt='' /> {prize.name}
                            </div> : null}

                            {!prize && check && check.products ? <div className='winners__prize'>
                                {check.products.map((el, i) => (<span>{el.product.name} <br/></span>))}
                            </div> : null}
                        </div>
                    </div>
                }
            }
            return <div className='winners winners--checks'>
                <h3><span>Главный приз</span></h3>
                {data.slice(0, 1).map(view)}
                <h3><span>Призеры розыгрыша</span></h3>
                {data.slice(1 - data.length).map(view)}
                {video ? <div className='winners__after'>
                    <h3 className='white'><span>Видео розыгрыша</span></h3>
                    <div className='winners__video'>
                        <iframe width='100%' height='315' src={'https://www.youtube.com/embed/' + video + '?showinfo=0&controls=2&rel=0'} frameborder='0' allowfullscreen></iframe>
                        </div>
                    </div> : null}
            </div>
        case 'share-history':
        case 'maraphon':
        case 'heart':
            data.sort((a, b) => {
                if (a.additional.full || b.additional.full) return 1
                if (a.additional.link && b.additional.link) return this.getByLink(a.additional.link).length - this.getByLink(b.additional.link).length
                return 0
            })
            return <div className='winners'>
                {data.map((el, i) => {
                    let { additional, prize } = el
                    let { photo, name, link } = additional
                    let network = this.getByLink(link)
                    if (additional.full) {
                        return <div className={`winners__item winners__item--full`} key={i}>
                            <div className='winners__col'>
                                <h4>Победитель акции</h4>
                            </div>
                            <div className='winners__col'>
                                <div className='winners__photo' style={{backgroundImage: `url(${photo ? photo : '/layout/images/svg/avatar.svg'})`}}/>
                                <div className='winners__name'>{name}</div>
                            </div>
                            <div className='winners__col'>
                                {prize ? <div className='winners__prize'>
                                    <img src={prize.photo} alt='' /> {prize.name}
                                </div> : null}
                            </div>
                        </div>
                    }
                    return <div className={`winners__item`} key={i}>
                        {network ? <div className='winners__network'>{network}</div> : null}
                        <div className='winners__photo' style={{backgroundImage: `url(${photo ? photo : '/layout/images/svg/avatar.svg'})`}}/>
                        <div className='winners__name'>{name}</div>
                        {prize ? <div className='winners__prize'>
                            <img src={prize.photo} alt='' /> {prize.name}
                        </div> : null}
                    </div>
                })}
            </div>
        case 'test':
        case 'kitchen':
        case 'present':
            return <div className='winners'>
                {data
                    .sort((a, b) => {
                        if (a.additional.full || b.additional.full) return 1
                    })
                    .map((el, i) => {
                        let { position, user, additional, prize } = el
                        if (user && prize) {
                            let { photo, displayName } = user
                            let { photo: image, name } = prize
                            let { scores, likes } = additional
                            if (additional.full) {
                                return <div className={`winners__item winners__item--full`} key={i}>
                                    <div className='winners__col'>
                                        <h4>Победитель акции</h4>
                                    </div>
                                    <div className='winners__col'>
                                        <div className='winners__photo' style={{backgroundImage: `url(${photo ? photo : '/layout/images/svg/avatar.svg'})`}}/>
                                        <div className='winners__name'>{displayName}</div>
                                    </div>
                                    <div className='winners__col'>
                                        {image ? <div className='winners__prize'>
                                            <img src={image} alt='' /> {name}
                                        </div> : null}
                                    </div>
                                </div>
                            }
                            return <div className={`winners__item winners__item--games-${position}`} key={i}>
                                <div className='winners__position'>
                                    {position} место
                                </div>
                                { game === 'present' ? <div className='winners__scores'>
                                    <strong>{likes}</strong><br/>
                                    {pluralize(likes, ['лайк', 'лайка', 'лайков', 'лайка'])}
                                </div> : <div className='winners__scores'>
                                    <strong>{scores}</strong><br/>
                                    {pluralize(scores, ['балл', 'балла', 'баллов', 'балла'])}
                                </div> }
                                <div className='winners__photo' style={{backgroundImage: `url(${photo ? photo : '/layout/images/svg/avatar.svg'})`}}/>
                                <div className='winners__name'>{displayName}</div>
                                {prize ? <div className='winners__prize'>
                                    <img src={image} alt='' /> {name}
                                </div> : null}
                            </div>
                        }
                        return null
                    })}
            </div>
        default:

        }
    }
    render() {
        let {game, games, raffle, data} = this.state
        let dates = []
        games.filter(el => (el.code === game)).map(el => {
            el.raffles.map(d => {
                dates.push({name: moment(d[1]).format('DD.MM.YYYY'), code: JSON.stringify(d)})
            })
        })

        return <div className='rating'>
            <Helmet title='Russell Hobbs | Итоги конкурса'/>

                {games.length > 0 ? <Formsy.Form ref='form_top' className='form rating__title' onChange={this.handleTopFormChange.bind(this)}>
                    <h3>Победители конкурса</h3>
                    <div className='rating__select'>
                        <Dropdown name='game' className='dropdown--small' items={games.map(el => {
                            return {name: el.name, code: el.code}
                        })} value={game} />
                    </div>
                    <div className='rating__select'>
                        <h3>от</h3>
                        <Dropdown name='raffle' className='dropdown--small dropdown--dates' items={dates}
                            value={raffle ? raffle : dates[0] ? dates[0].code : null}
                            />
                        <span>Дата розыгрыша</span>
                    </div>
                    {data.length > 0 ? this.getRusults() : <div className='center padding'>
                        <h2>Список победителей будет опубликован в ближайшее время</h2>
                    </div>}
                </Formsy.Form> : <div className='center padding'>
                    <h2>Список победителей будет опубликован в ближайшее время</h2>
                </div> }


        </div>
    }
}

export default Winners
