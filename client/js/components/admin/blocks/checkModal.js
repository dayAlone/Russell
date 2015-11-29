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
        let {_id, organisation, inn, eklz, date, time, total, kpk_number, kpk_value, photo, photo2, status_comment, count, condition} = this.state.fields

        return <Modal ref='modal' className='modal modal--edit-check' onHide={this.onHide.bind(this)}>
            <h3 className='modal__title modal__title--border'>Информация о чеке</h3>
            {this.state.message ? <div className='alert' role='alert'>{this.state.message}</div> : null}
            {this.state.error ? <div className='alert alert--error' role='alert'>{this.state.error}</div> : null}

            <Formsy.Form ref='form' className='form' onSubmit={this.submitForm.bind(this)}>
                <Input type='hidden' name='id' value={_id}/>

                <div className='form__content'>
                    <div className='form__col'>
                        <label>Фото</label>
                        <a href={photo} target='_blank' className='form__image' style={{backgroundImage: `url(${photo})`}}></a>
                        {photo2 ? <a href={photo2} target='_blank' className='form__image' style={{backgroundImage: `url(${photo2})`}}></a> : null}
                    </div>
                    <div className='form__col'>
                        <Input title='Наименование магазина' name='organisation' value={organisation}/>
                        <Input title='Дата' name='date' classFrame='form__date' value={date}/>
                        <Input title='Время' name='time' classFrame='form__time' value={time}/>
                        <Input title='Сумма покупки' name='total' value={total}/>
                        <Input title='Товаров RH в чеке' name='count' value={count} classFrame='form__count'/>
                    </div>
                    <div className='form__col'>
                        <Input title='ЭКЛЗ' name='eklz' value={eklz}/>
                        <Input title='ИНН' name='inn' value={inn}/>
                        <Input title='Номер КПК' name='kpk_number' value={kpk_number}/>
                        <Input title='Значение КПК' name='kpk_value' value={kpk_value}/>
                    </div>
                </div>

                <div className='modal__footer'>
                    <div className='form__col'>
                        <label>Статус чека</label>
                        <Dropdown name='status' className='dropdown--small' items={[
                            {name: 'Ждет отправки на АВ', code: 'added'},
                            {name: 'Активен', code: 'active'},
                            {name: 'Отклонен', code: 'canceled'},
                            {name: 'Ждет модерации', code: 'moderation'},
                        ]} value={condition}/>
                    </div>
                    <div className='form__col'>
                        <Textarea title='Комментарий модератора' placeholder='Комментарий модератора' name='status_comment' value={status_comment}/>
                        <button type='submit' disabled={this.state.disabled}>
                            {this.state.disabled ? <img src='/layout/images/loading.gif' /> : null}
                            Сохранить изменения
                        </button>
                        <a href='#' className='form__cancel' onClick={this.hide.bind(this)}><span>Отменить</span></a>
                    </div>

                </div>

            </Formsy.Form>
        </Modal>
    }
}

export default CheckModal
