import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'

import Formsy from 'formsy-react'
import {Dropdown} from '../../forms/'

import Spinner from '../../ui/Spinner'
import Modal from '../../ui/Modal'
import * as profileActionCreators from '../../../actions/profile'

@connect(state => ({ checks: state.profile.checks }), dispatch => ({profile: bindActionCreators(profileActionCreators, dispatch)}), null, { withRef: true })
class ChecksAssignModal extends Component {
    state = { name: false, id: false, disabled: false, count: false }
    show(name, id) {
        this.setState({name: name, id: id})
        this.refs.modal.show()
        if (this.props.checks.length === 0) {
            this.props.profile.getChecks()
        }
    }
    hide(e) {
        this.refs.modal.hide()
        if (e) e.preventDefault()
    }
    onChange(el) {
        this.setState({count: el.count})
    }
    onSubmit(fields) {
        this.props.profile.assignProduct(fields.check, this.state.id)
        this.refs.modal.hide()
    }
    render() {
        let checks = []
        if (this.props.checks.length > 0) {
            this.props.checks.filter(el => (el.count - el.products.length > 0)).map((el, i) => {
                checks.push({
                    code: el._id,
                    name: 'ID: ' + el._id + ' – ' + el.organisation,
                    count: el.count - el.products.length
                })
            })
        }
        return <Modal ref='modal' className='modal modal--checks'>
            {this.props.checks.length ?
                checks.length > 0 ?
                    <div className='check-select'>
                        <div className='check-select__name'>
                            {this.state.name}
                        </div>
                        <Formsy.Form ref='form' className='form center' onSubmit={this.onSubmit.bind(this)}>
                            <div className='check-select__label'>Выберите чек для привязки</div>
                            <Dropdown name='check' items={checks} value={checks[0].code} onChange={this.onChange.bind(this)}/>
                            <div className='check-select__label'>Количество возможных привязок к этому чеку</div>
                            <div className='check-select__count'>
                                {this.state.count ? this.state.count : checks[0].count}
                            </div>
                            <button type='submit' disabled={this.state.disabled}>
                                {this.state.disabled ? <img src='/layout/images/loading.gif' /> : null}
                                Привязать
                            </button>
                        </Formsy.Form>
                        <small>Отвязать товар от чека вы можете в личном кабинете<br/> пользователя во вкладке «Избранное»</small>
                    </div>
                :
                    <div className='center'>
                        <div className='message'>
                            Для добавления товара в избранное необходимо <Link to='/profile/checks/'>добавить чек</Link>
                        </div>
                        <a href='#' onClick={this.hide.bind(this)} className='button button--small'>Закрыть</a>
                    </div>
            : <Spinner color='#dd2827'/>
            }
        </Modal>
    }
}

export default ChecksAssignModal
