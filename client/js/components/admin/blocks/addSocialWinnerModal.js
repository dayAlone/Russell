import React, { Component } from 'react'
import Modal from '../../ui/Modal'
import Formsy from 'formsy-react'
import {Input, Dropdown, File} from '../../forms/'

Formsy.addValidationRule('minLengthOrEmpty', (values, value, length) => {
    return value && value.length >= length
})

class addSocialWinnerModal extends Component {
    state = {error: false}
    show() {
        this.refs.modal.show()
    }
    hide(e) {
        this.refs.modal.hide()
        this.refs.form.reset()
        if (e) e.preventDefault()
    }
    submitForm(fields) {
        this.setState({
            disabled: true,
            message: false,
            error: false
        })
        let formData = new FormData()
        let file = this.refs.file.getFiles()
        formData.append('photo', file)
        formData.append('item', true)
        for (let el in fields) {
            if (el !== 'photo') {
                formData.append(el, fields[el])
            }
        }
        $.ajax(
            {
                type: 'POST',
                url: '/admin/winners/add/',
                processData: false,
                cache: false,
                contentType: false,
                data: formData
            })
            .done(data => {

                if (data.result === 'success') {
                    this.hide()
                    this.props.loadDataFromServer()

                }
                if (data.error) {
                    this.setState({
                        disabled: false,
                        error: data.error.message
                    })
                }
                this.setState({
                    disabled: false
                })
            })
            .fail(() => {
                this.setState({
                    disabled: false,
                    error: 'Что-то пошло не так, повторите попытку через пару минут'
                })
            })
    }
    componentDidMount() {
        if (this.props.shown === true) this.show()
    }
    componentDidUpdate() {
        if (this.props.shown === true && this.refs.modal.hasHidden()) this.show()
    }
    render() {
        let {raffles, items, game, raffle} = this.props

        return <Modal ref='modal' className='modal modal--add-winner'>
            <h3 className='modal__title modal__title--border'>Добавить победителя</h3>
            {this.state.error ? <div className='alert' role='alert'>{this.state.error}</div> : null}
            {game && raffle ? <Formsy.Form ref='form' className='form' onSubmit={this.submitForm.bind(this)}>
                <Input name='name' title='Имя, фамилия' validations='minLengthOrEmpty:1'/>
                <Input name='link' title='Ссылка на профиль в социальной сети' validations='minLengthOrEmpty:1'/>
                <label>Фото</label>
                <File name='photo' ref='file' title='Загрузить фото' validations='minLengthOrEmpty:1' value='' accept='image/jpeg,image/png,image/gif'/>
                <div className='form__cols'>
                    <div className='form__col'>
                        <label>Активность</label>
                        <Dropdown onChange={this.props.changeGame} name='game' items={items} value={game}/>
                    </div>
                    <div className='form__col'>
                        <label>Дата / период розыгрыша</label>
                        <Dropdown name='raffle' items={raffles} value={raffle}/>
                    </div>
                </div>


                <div className='modal__footer right'>
                    <button type='submit' disabled={this.state.disabled}>
                        {this.state.disabled ? <img src='/layout/images/loading.gif' /> : null}
                        Сохранить изменения
                    </button>
                </div>
            </Formsy.Form> : null }
        </Modal>
    }
}

export default addSocialWinnerModal
