import React, { Component } from 'react'
import Modal from '../../ui/Modal'
class GetRandomScoresModal extends Component {
    state = {
        step: 0,
        result: 0,
        counts: 0
    }
    show() {
        this.setState({
            step: 0,
            result: 0,
            counts: 0
        })
        this.refs.modal.show()
    }
    hide(e) {
        this.refs.modal.hide()
        if (e) e.preventDefault()
    }
    tick() {

        if (this.state.counts < 10) {
            this.setState({
                counts: this.state.counts + 1,
                result: parseInt(Math.random() * (100 - 1) + 1, 10)
            })
        } else {
            let data = this.props.data.filter((el, i) => (this.props.values.indexOf(i.toString()) !== -1))
            clearInterval(this.state.counter)
            this.setState({
                step: 2,
                result: parseInt(Math.random() * data.length, 10)
            })
        }
    }
    startCount() {
        this.setState({
            step: 1,
            counts: 0,
            counter: setInterval(this.tick.bind(this), 100)
        })
    }
    render() {
        let {data, values} = this.props
        if (values) {
            data = data.filter((el, i) => (values.indexOf(i.toString()) !== -1))
            return <Modal ref='modal' className='modal modal--random-scores center'>
                <h2 className='modal__title modal__title--border'>Выбор случайного победителя</h2>
                {this.state.step === 0 ? <div>
                    <h5>Выбор среди пользователей:</h5>
                    <ol>
                        {data.map((el, i) => {
                            return <li key={i}>{i + 1}. {el}</li>
                        })}
                    </ol>
                    <a href='#' className='button button--small' onClick={this.startCount.bind(this)}>Начать случайный выбор призера</a>
                </div> : null}
                {this.state.step > 0 ? <div>
                    <h1>{this.state.result + 1}</h1>
                    {this.state.step === 2 ? <div>
                        <h5>Выбор среди пользователей:</h5>
                        <h4>{data[this.state.result]}</h4><br/>
                        <a href='#' className='button button--small' onClick={this.hide.bind(this)}>Закрыть</a>
                    </div> : null}
                </div> : null }
            </Modal>
        }
        return null
    }
}

export default GetRandomScoresModal
