import React, { Component } from 'react'

import Formsy from 'formsy-react'
import {Input, Dropdown, Textarea} from '../../forms/'

import Modal from '../../ui/Modal'

class CheckModal extends Component {

    state = {
        message: false,
        disabled: false,
        fields: {}
    }
    show(fields, condition) {
        if (fields) {
            fields['condition'] = condition
            this.setState({fields: fields})
        }
        this.refs.modal.show()
    }
    hide(e) {
        this.refs.modal.hide()
        this.refs.form.reset()
        if (e) e.preventDefault()
    }
    componentDidUpdate() {
        if (this.state.fields.photo && !this.state.sizes) {
            let img = new Image()
            let photo = this.state.fields.photo
            img.onload = () => {
                this.setState({sizes: {w: img.width, h: img.height}})
            }
            img.src = photo.indexOf('http') === -1 ? `http://${location.hostname}${location.port ? ':' + location.port : ''}${photo}` : photo
        }
    }
    submitForm(fields) {
        this.setState({
            disabled: true,
            message: false,
            error: false
        })
        $.ajax(
            {
                type: 'POST',
                url: '/admin/checks/update/',
                data: fields
            })
            .done(data => {
                if (data.status === 'success') {
                    this.props.loadChecksFromServer()
                    this.refs.form.reset()
                    this.hide()
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
    onHide() {
        this.setState({fields: [], sizes: false})
    }
    render() {
        let {_id, organisation, inn, eklz, date, time, total, kpk_number, kpk_value, photo, status_comment, count, condition} = this.state.fields

        return <Modal ref='modal' className='modal modal--edit-check' onHide={this.onHide.bind(this)}>
            <h3 className='modal__title modal__title--border'>Информация о чеке</h3>

            <div className='form__col'>
                <div className='form__title'>Фото</div>
                <a href='#' className='form__image' onClick={this.props.openPhotoSwipe(photo, this.state.sizes)} style={{backgroundImage: `url(${photo})`}}></a>
            </div>
            <div className='form__col'>
                <Formsy.Form ref='form' className='form' onSubmit={this.submitForm.bind(this)}>
                    {this.state.message ? <div className='alert' role='alert'>{this.state.message}</div> : null}
                    {this.state.error ? <div className='alert alert--error' role='alert'>{this.state.error}</div> : null}
                    <Input type='hidden' name='id' value={_id}/>
                    <div className='form__title'>Информация</div>
                    <div className='form__info'>
                        {this.state.fields ? <div>
                            <div className='form__col'>
                                <span>ID: {_id}</span>
                                <span>ЭКЛЗ: {eklz} </span>
                                <span>Дата: {date} </span>
                                <span>Время: {time}</span>
                                <span>Сумма: {total}</span>
                            </div>
                            <div className='form__col'>
                                <span>{organisation ? `Организация: ${organisation}` : null}</span>
                                <span>ИНН: {inn}</span>
                                <span>Номер КПК: {kpk_number} </span>
                                <span>Значение КПК: {kpk_value}</span>
                            </div>
                        </div> : null}

                    </div>
                    <div className='form__title'>Количество товаров в чеке</div>

                    <Input placeholder='КК' name='count' value={count}/>
                    <div className='form__title'>Статус чека</div>
                    <Dropdown name='status' className='dropdown--small' items={[
                        {name: 'Прошел АВ', code: 'correct'},
                        {name: 'Ждет отправки на АВ', code: 'added'},
                        {name: 'Активен', code: 'active'},
                        {name: 'Отклонен', code: 'canceled'}
                    ]} value={condition}/>
                    <Textarea placeholder='Комментарий модератора' name='status_comment' value={status_comment}/>
                    <div className='modal__footer'>
                        <button type='submit' disabled={this.state.disabled}>
                            {this.state.disabled ? <img src='/layout/images/loading.gif' /> : null}
                            Сохранить изменения
                        </button>
                        <a href='#' className='form__cancel' onClick={this.hide.bind(this)}><span>Отменить</span></a>
                    </div>
                </Formsy.Form>
            </div>

        </Modal>
    }
}

export default CheckModal
