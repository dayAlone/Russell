import React, { Component } from 'react'
import Modal from '../../ui/Modal'
import { Link } from 'react-router'
class GetRandomScoresModal extends Component {
    state = {
        step: 0,
        result: 0,
        counts: 0,
        items: [],
        max: 6
    }
    show() {
        this.setState({
            step: 0,
            result: 0,
            counts: 0,
            items: [],
            max: 6
        })
        this.refs.modal.show()
    }
    hide(e) {
        this.refs.modal.hide()
        if (e) e.preventDefault()
    }
    tick() {
        let {counts, items, request} = this.state
        if (counts < 10 || request) {
            this.setState({
                counts: counts + 1,
                result: this.props.numbers[parseInt(Math.random() * this.props.numbers.length, 10)]
            })
        } else {
            if (items.length > 0) {
                this.setState({
                    counts: 0,
                    result: items[items.length - 1]._id
                })
            }

            clearInterval(this.state.counter)
        }
    }
    GetRandomCheckFromServer() {
        setTimeout(() => {
            $.post('/admin/checks/random/',
                {
                    raffle: this.props.raffle,
                    ids: this.state.items.map(el => (el._id))
                },
                data => {
                    let fields = { request: false }
                    let items = this.state.items
                    items.push(data.item)
                    fields = { request: false, items: items}
                    if (data.finish) {
                        fields.max = items.length
                    }
                    this.setState(fields)
                }
            )
        }, 200)

    }
    startCount() {
        this.setState({
            step: 1,
            counts: 1,
            request: true,
            counter: setInterval(this.tick.bind(this), 100)
        }, this.GetRandomCheckFromServer)
    }
    saveResults(e) {
        let game = this.props.games.filter(el => (el.code === this.props.game))[0]

        $.post('/admin/winners/add/', {
            items: this.state.items.map((el, i) => ({
                user: el.user._id,
                place: i,
                additional: { check: el._id }
            })),
            raffle: this.props.raffle,
            game: game._id
        }, response => {
            if (!response.error) {
                this.setState({
                    step: 2
                })
            }
        })
        e.preventDefault()
    }
    render() {
        let {step, result, items, counts, max} = this.state
        let {game, raffle} = this.props
        return <Modal ref='modal' className='modal modal--random-scores center'>
            {step < 2 ? <div>
                <h2 className='modal__title modal__title--border'>Выбор случайных чеков</h2>
                {step === 0 ? <div>
                    <a href='#' className='button button--small' onClick={this.startCount.bind(this)}>Начать выбор случайных чеков</a>
                    <br/><br/>
                </div> : null}
                {step === 1 ? <div>
                    <h1>{result}</h1>
                    {items.length > 0 && counts === 0 && items.length < max ? <a href='#' className='button button--small button--no-margin' onClick={this.startCount.bind(this)}>Сгенерировать еще</a> : null }
                    <div className='modal__winners'>
                        {counts === 0 ? items
                            .slice(0, counts === 0 ? items.length : items.length - 1)
                            .map((el, i) => (<div key={i}>
                                <strong>{i === 0 ? 'Победитель' : 'Призер ' + i}</strong>
                                <span>ID чека: {el._id} <small>({el.user ? el.user.displayName : null})</small></span>

                            </div>)) : null}
                    </div>

                    {items.length === max && counts === 0 ? <span><a href='#' className='button button--small' onClick={this.saveResults.bind(this)}>Сохранить данные розыгрыша</a><br/><br/></span> : null}

                </div> : null }
            </div> : null }
            {step === 2 ? <div>
                <h2 className='modal__title modal__title--border'>Победители сформированы</h2>
                <div className='modal__message'>
                    'Теперь им необходимо отправить уведомления'
                </div>
                <Link to={`/admin/winners/?game=${game}&raffle=${raffle}`} className='button--small button'>Перейти в раздел с победителями</Link>
            </div> : null}
        </Modal>
    }
}

export default GetRandomScoresModal
