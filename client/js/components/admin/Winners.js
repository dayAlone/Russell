import React, { Component } from 'react'
import Helmet from 'react-helmet'
import ReactDOM from 'react-dom'
import ReactPaginate from 'react-paginate'
import { connect } from 'react-redux'
import { toObj } from 'form-data-to-object'
import Spinner from '../ui/Spinner'
import AddSocialWinnerModal from './blocks/addSocialWinnerModal'
import Formsy from 'formsy-react'
import { Dropdown, Input } from '../forms/'
import moment from 'moment'

import * as actionCreators from '../../actions/games'
import { bindActionCreators } from 'redux'

class CheckRow extends Component {
    state = {
        hover: false,
        disabled_save: false,
        disabled_send: false
    }
    onMouseEnter() {
        this.setState({ hover: true })
    }
    onMouseLeave() {
        this.setState({ hover: false })
    }
    savePrize(e) {
        let { savePrize, el} = this.props
        let { _id } = el
        this.setState({ disabled_save: true }, savePrize(_id, this.savedCallback.bind(this)))
        e.preventDefault()
    }
    sendMail(e) {
        let { sendMail, el} = this.props
        let { _id } = el
        this.setState({ disabled_send: true }, sendMail(_id))
        e.preventDefault()
    }
    deleteWinner(e) {
        let { deleteWinner, el} = this.props
        let { _id } = el
        deleteWinner(_id)()
        e.preventDefault()
    }
    savedCallback() {
        this.setState({ disabled_save: false })
    }
    render() {
        let {user, additional, position, prize, _id, sended} = this.props.el
        let {hover, disabled_save, disabled_send} = this.state
        if (additional.check) {
            return <div className='table__row' onMouseEnter={this.onMouseEnter.bind(this)} onMouseLeave={this.onMouseLeave.bind(this)}>
                <div className='table__col'>{user ? user.displayName : null}</div>
                <div className='table__col'>{additional.check._id}</div>
                <div className='table__col'>{position === 0 ? 'Главный приз' : 'Призер ' + position}</div>
                {position === 0 ? <div className='table__col'>
                    <Dropdown name={`prizes[${_id}]`} className='dropdown--small' items={this.props.prizes.map(el=>({
                        name: el.name,
                        code: el._id
                    }))} value={prize ? prize._id : this.props.prizes[0]._id}/>
                    {hover || disabled_save ? <a href='#' onClick={this.savePrize.bind(this)} className={`btn ${disabled_save ? 'btn--disabled' : ''}`}>
                        {disabled_save ? <img src='/layout/images/loading.gif' alt='' /> : null} Сохранить
                    </a> : null}
                </div> : <div className='table__col'>
                    {additional.check.products.map((el, i) => {
                        console.log(el)
                        return <span key={i}>{el.product.name}<br/></span>
                    })}
                </div> }
                <div className='table__col'>
                    {!sended && (hover || disabled_send) ? <a href='#' onClick={this.sendMail.bind(this)} className={`btn ${disabled_send ? 'btn--disabled' : ''}`}>{disabled_send ? <img src='/layout/images/loading.gif' alt='' /> : null} Уведомить</a> : null}
                </div>
                <div className='table__col'>
                    {hover ? <a href='#' onClick={this.deleteWinner.bind(this)} className='btn'>x</a> : null}
                </div>
            </div>
        } else {
            return null
        }
    }
}

class GameRow extends Component {
    state = {
        hover: false,
        disabled_save: false,
        disabled_send: false
    }
    onMouseEnter() {
        this.setState({ hover: true })
    }
    onMouseLeave() {
        this.setState({ hover: false })
    }
    savePrize(e) {
        let { savePrize, el} = this.props
        let { _id } = el
        this.setState({ disabled_save: true }, savePrize(_id, this.savedCallback.bind(this)))
        e.preventDefault()
    }
    sendMail(e) {
        let { sendMail, el} = this.props
        let { _id } = el
        this.setState({ disabled_send: true }, sendMail(_id))
        e.preventDefault()
    }
    deleteWinner(e) {
        let { deleteWinner, el} = this.props
        let { _id } = el
        deleteWinner(_id)()
        e.preventDefault()
    }
    savedCallback() {
        this.setState({ disabled_save: false })
    }
    render() {
        let {user, additional, position, prize, _id, sended} = this.props.el
        let {hover, disabled_save, disabled_send} = this.state
        return <div className='table__row' onMouseEnter={this.onMouseEnter.bind(this)} onMouseLeave={this.onMouseLeave.bind(this)}>
            <div className='table__col'>{user ? user.displayName : null}</div>
            <div className='table__col'>{additional.scores}</div>
            <div className='table__col'>{position}</div>
            <div className='table__col'>
                <Dropdown name={`prizes[${_id}]`} className='dropdown--small' items={this.props.prizes.map(el=>({
                    name: el.name,
                    code: el._id
                }))} value={prize ? prize._id : this.props.prizes[0]._id}/>
                {hover || disabled_save ? <a href='#' onClick={this.savePrize.bind(this)} className={`btn ${disabled_save ? 'btn--disabled' : ''}`}>
                    {disabled_save ? <img src='/layout/images/loading.gif' alt='' /> : null} Сохранить
                </a> : null}
            </div>
            <div className='table__col'>
                {!sended && (hover || disabled_send) ? <a href='#' onClick={this.sendMail.bind(this)} className={`btn ${disabled_send ? 'btn--disabled' : ''}`}>{disabled_send ? <img src='/layout/images/loading.gif' alt='' /> : null} Уведомить</a> : null}
            </div>
            <div className='table__col'>
                {hover ? <a href='#' onClick={this.deleteWinner.bind(this)} className='btn'>x</a> : null}
            </div>
        </div>
    }
}

class PresentRow extends Component {
    state = {
        hover: false,
        disabled_save: false,
        disabled_send: false
    }
    onMouseEnter() {
        this.setState({ hover: true })
    }
    onMouseLeave() {
        this.setState({ hover: false })
    }
    savePrize(e) {
        let { savePrize, el} = this.props
        let { _id } = el
        this.setState({ disabled_save: true }, savePrize(_id, this.savedCallback.bind(this)))
        e.preventDefault()
    }
    sendMail(e) {
        let { sendMail, el} = this.props
        let { _id } = el
        this.setState({ disabled_send: true }, sendMail(_id))
        e.preventDefault()
    }
    deleteWinner(e) {
        let { deleteWinner, el} = this.props
        let { _id } = el
        deleteWinner(_id)()
        e.preventDefault()
    }
    savedCallback() {
        this.setState({ disabled_save: false })
    }
    handleChange(value) {
        this.props.setFullWinner(this.props.el._id, value)
    }
    render() {
        let {user, additional, position, prize, _id, sended} = this.props.el
        let {hover, disabled_save, disabled_send} = this.state
        return <div className='table__row' onMouseEnter={this.onMouseEnter.bind(this)} onMouseLeave={this.onMouseLeave.bind(this)}>
            <div className='table__col'>{user ? user.displayName : null}</div>
            <div className='table__col'>{additional.likes}</div>
            <div className='table__col'>{position}</div>
            <div className='table__col'>
                <Input type='checkbox' name='full' onChange={this.handleChange.bind(this)} value={additional.full ? true : false}/>
            </div>
            <div className='table__col'>
                <Dropdown name={`prizes[${_id}]`} className='dropdown--small' items={this.props.prizes.map(el=>({
                    name: el.name,
                    code: el._id
                }))} value={prize ? prize._id : this.props.prizes[0]._id}/>
                {hover || disabled_save ? <a href='#' onClick={this.savePrize.bind(this)} className={`btn ${disabled_save ? 'btn--disabled' : ''}`}>
                    {disabled_save ? <img src='/layout/images/loading.gif' alt='' /> : null} Сохранить
                </a> : null}
            </div>
            <div className='table__col'>
                {!sended && (hover || disabled_send) ? <a href='#' onClick={this.sendMail.bind(this)} className={`btn ${disabled_send ? 'btn--disabled' : ''}`}>{disabled_send ? <img src='/layout/images/loading.gif' alt='' /> : null} Уведомить</a> : null}
            </div>
            <div className='table__col'>
                {hover ? <a href='#' onClick={this.deleteWinner.bind(this)} className='btn'>x</a> : null}
            </div>
        </div>
    }
}

class SocialRow extends Component {
    state = {
        hover: false,
        disabled_save: false
    }
    onMouseEnter() {
        this.setState({ hover: true })
    }
    onMouseLeave() {
        this.setState({ hover: false })
    }
    savePrize(e) {
        let { savePrize, el} = this.props
        let { _id } = el
        this.setState({ disabled_save: true }, savePrize(_id, this.savedCallback.bind(this)))
        e.preventDefault()
    }
    deleteWinner(e) {
        let { deleteWinner, el} = this.props
        let { _id } = el
        deleteWinner(_id)()
        e.preventDefault()
    }
    savedCallback() {
        this.setState({ disabled_save: false })
    }
    handleChange(value) {
        this.props.setFullWinner(this.props.el._id, value)
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
    render() {
        let {additional, prize, _id} = this.props.el
        let {name, link, photo, full} = additional
        let {hover, disabled_save } = this.state
        return <div className='table__row' onMouseEnter={this.onMouseEnter.bind(this)} onMouseLeave={this.onMouseLeave.bind(this)}>
            <div className='table__col'>{name}</div>
            <div className='table__col'>{this.getByLink(link)}</div>
            <div className='table__col'>
                <Input type='checkbox' name='full' onChange={this.handleChange.bind(this)} value={full ? true : false}/>
            </div>
            <div className='table__col'>
                <Dropdown name={`prizes[${_id}]`} className='dropdown--small' items={this.props.prizes.map(el=>({
                    name: el.name,
                    code: el._id
                }))} value={prize ? prize._id : this.props.prizes[0]._id}/>
                {hover || disabled_save ? <a href='#' onClick={this.savePrize.bind(this)} className={`btn ${disabled_save ? 'btn--disabled' : ''}`}>
                    {disabled_save ? <img src='/layout/images/loading.gif' alt='' /> : null} Сохранить
                </a> : null}
            </div>
            <div className='table__col'>
                {hover ? <a href='#' onClick={this.deleteWinner.bind(this)} className='btn'>x</a> : null}
            </div>
        </div>
    }
}

@connect(state => ({ games: state.games.list, prizes: state.games.prizes }), dispatch => ({actions: bindActionCreators(actionCreators, dispatch)}))
class Competition extends Component {
    state = {
        accepted: ['checks', 'kitchen', 'test', 'share-history', 'maraphon', 'heart', 'focus', 'present'],
        game: false,
        social: ['share-history', 'maraphon', 'heart', 'focus'],
        raffle: false,
        data: [],
        list: false,
        raffles: false,
        modal: false
    }
    componentDidMount() {
        if (this.props.games.length === 0) this.props.actions.getGames()
        if (this.props.prizes.length === 0) this.props.actions.getPrizes()
        this.setList()
    }
    componentDidUpdate(prevProps) {
        if (this.props.games.length > 0 && prevProps.games.length === 0) this.setList()
    }
    handleFormChange(fields) {
        if (!fields.game) fields = this.refs.form.getCurrentValues()
        if (fields.game && fields.game !== this.state.game) {
            this.setState({
                game: fields.game,
                raffle: false
            }, () => {
                this.setList()
            })
        } else {
            this.setState(toObj(fields), this.loadDataFromServer.bind(this))
        }
    }
    changeGame(game) {
        game = this.state.list.filter(el => (el.id === game.code))[0].code
        this.setState({
            game: game,
            raffle: false
        }, () => {
            this.setList()
        })
    }
    savePrize(id, callback) {
        let {prizes} = this.state
        return () => {
            $.post('/admin/winners/save-prize/', {
                id: id,
                prize: prizes[id]
            }, () => {
                if (callback) callback()
            })
        }
    }
    sendMail(id) {
        return () => {
            $.post('/admin/winners/send/', {
                id: id,
                raffle: this.state.raffle
            }, () => {
                this.loadDataFromServer()
            })
        }
    }
    deleteWinner(id) {
        return () => {
            $.post('/admin/winners/remove/', {
                id: id
            }, () => {
                this.loadDataFromServer()
            })
        }
    }
    setFullWinner(id, value) {

        $.post('/admin/winners/full/', {
            id: id,
            value: value
        }, () => {
            this.loadDataFromServer()
        })

    }
    loadDataFromServer() {
        let {game, raffle} = this.state
        let url = '/games/winners/get/'
        if (game && raffle) {
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
    }
    setList() {
        let { accepted, game, raffle } = this.state
        if (this.props.games.length > 0) {
            let list = this.props.games.filter(el => (accepted.indexOf(el.code) !== -1)).map(el => ({code: el.code, name: el.name, id: el._id}))
            if (!game) game = this.props.location.query.game ? this.props.location.query.game : list[0].code
            let current = this.props.games.filter(el => (el.code === game))[0]
            let raffles = []
            current.raffles.map((el, i) => {
                let raffle = [
                    i === 0 ? current.start : current.raffles[i - 1],
                    el
                ]
                raffles.push({
                    name: moment(raffle[0]).format('DD.MM') + ' – ' + moment(raffle[1]).format('DD.MM.YYYY'),
                    code: JSON.stringify(raffle)
                })
            })
            if (!raffle) raffle = this.props.location.query.raffle ? this.props.location.query.raffle : raffles[0].code
            this.setState({
                list: list,
                game: game,
                raffles: raffles,
                raffle: raffle
            }, this.loadDataFromServer.bind(this))
        }
    }
    getHeader() {
        switch (this.state.game) {
        case 'checks':
            return <div className='table__title'>
                <div className='table__col'>Пользователь</div>
                <div className='table__col'>ID чека</div>
                <div className='table__col'>Тип призера</div>
                <div className='table__col'>Приз</div>
                <div className='table__col'>Письмо</div>
            </div>
        case 'present':
            return <div className='table__title'>
                <div className='table__col'>Пользователь</div>
                <div className='table__col'>Лайков</div>
                <div className='table__col'>Место</div>
                <div className='table__col'>Победитель акции</div>
                <div className='table__col'>Приз</div>
                <div className='table__col'>Письмо</div>
            </div>
        case 'share-history':
        case 'focus':
        case 'maraphon':
        case 'heart':
            return <div className='table__title'>
                <div className='table__col'>пользователь</div>
                <div className='table__col'>Сеть</div>
                <div className='table__col'>Победитель акции</div>
                <div className='table__col'>приз</div>
                <div className='table__col'></div>
            </div>
        default:
            return <div className='table__title'>
                <div className='table__col'>Пользователь</div>
                <div className='table__col'>Набрано баллов</div>
                <div className='table__col'>Место</div>
                <div className='table__col'>Приз</div>
                <div className='table__col'>Письмо</div>
            </div>
        }
    }
    getRows(data) {
        switch (this.state.game) {
        case 'checks':
            return <div>
                {data.map((el, i) => {
                    return <CheckRow
                            setFullWinner={this.setFullWinner.bind(this)}
                            deleteWinner={this.deleteWinner.bind(this)}
                            sendMail={this.sendMail.bind(this)}
                            savePrize={this.savePrize.bind(this)}
                            el={el}
                            key={i}
                            prizes={this.props.prizes}/>
                })}
            </div>
        case 'share-history':
        case 'maraphon':
        case 'heart':
        case 'focus':
            return <div>
                {data.map((el, i) => {
                    return <SocialRow
                            setFullWinner={this.setFullWinner.bind(this)}
                            deleteWinner={this.deleteWinner.bind(this)}
                            savePrize={this.savePrize.bind(this)}
                            el={el}
                            key={i}
                            prizes={this.props.prizes}/>
                })}
            </div>
        case 'present':
            return <div>{data.map((el, i) => {
                return <PresentRow
                        setFullWinner={this.setFullWinner.bind(this)}
                        sendMail={this.sendMail.bind(this)}
                        deleteWinner={this.deleteWinner.bind(this)}
                        savePrize={this.savePrize.bind(this)}
                        el={el}
                        key={i}
                        prizes={this.props.prizes}/>
            })}</div>
        default:
            return <div>
                {data.map((el, i) => {
                    return <GameRow
                            sendMail={this.sendMail.bind(this)}
                            deleteWinner={this.deleteWinner.bind(this)}
                            savePrize={this.savePrize.bind(this)}
                            el={el}
                            key={i}
                            prizes={this.props.prizes}/>
                })}
            </div>
        }

    }
    getButtons() {
        switch (this.state.game) {
        case 'share-history':
        case 'maraphon':
        case 'heart':
        case 'focus':
            return <div className='table__buttons'>
                <a href='#' onClick={this.showAddModal.bind(this)} className='btn'>Добавить победителя</a>
            </div>
        default:
            return <div className='table__buttons'></div>
        }
    }
    showAddModal(e) {
        this.setState({
            modal: true
        })
        e.preventDefault()
    }
    hideAddModal() {
        this.setState({
            modal: false
        })
    }
    render() {
        let { game, raffle, list, raffles, data} = this.state

        if (game && raffle) {
            return <div className='admin-winners'>
                <Helmet title='Russell Hobbs | Кабинет модератора | Победители'/>
                <Formsy.Form ref='form' className='form' onChange={this.handleFormChange.bind(this)}>
                    <div className='admin__toolbar'>
                        <Dropdown name='game' className='dropdown--small' items={list} value={game}/>
                        <Dropdown name='raffle' className='dropdown--small' items={raffles} value={raffle}/>
                        {this.getButtons()}
                    </div>
                    <div className={`table admin-winners__table admin-winners__table--${game}`}>
                        {this.getHeader()}
                        {data.length > 0 ? this.getRows(data) : <div className='table__row table__row--message center'>
                            Нет данных за текущий период.
                        </div>}
                    </div>
                </Formsy.Form>
                <AddSocialWinnerModal hideAddModal={this.hideAddModal.bind(this)} changeGame={this.changeGame.bind(this)} ref='modal' shown={this.state.modal} loadDataFromServer={this.loadDataFromServer.bind(this)} raffles={raffles} items={list.filter(el=>(this.state.social.indexOf(el.code) !== -1)).map(el=>({code: el.id, name: el.name}))} game={list.filter(el=>(el.code === game))[0].id} raffle={raffle}/>
            </div>
        }
        return <Spinner color='#e32c21'/>
    }
}

export default Competition
