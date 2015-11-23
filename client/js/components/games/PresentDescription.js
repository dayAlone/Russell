import React, { Component } from 'react'
import { connect } from 'react-redux'
import Title from '../layout/Title'

import { Link } from 'react-router'
import * as actionCreators from '../../actions/login'
import { bindActionCreators } from 'redux'

@connect(state => ({isLogin: state.login.isLogin}), dispatch => ({actions: bindActionCreators(actionCreators, dispatch)}))
class PresentDescription extends Component {
    openModal(e) {
        const { openModal } = this.props.actions
        openModal()
        e.preventDefault()
    }
    render() {

        return <div className='present'>
                <h2 className='center'>В подарок. Для себя</h2>
                <div className='present__description text'>

                    <p className='center'>Техника Russell Hobbs - отличный подарок!<br/>Мы поможем намекнуть вашим близким, что они могли бы подарить вам на Новый год.<br/>Как? Да очень просто! </p>
                    <div className='present__col'>
                        <p className='text__number' data-text='1'>
                            Выберите технику, которую вы бы хотели получить в подарок
                        </p>
                    </div>
                    <div className='present__col'>
                        <p className='text__number' data-text='2'>
                            Загрузите свое фото в специальный шаблон
                        </p>
                    </div>
                    <div className='present__col'>
                        <p className='text__number' data-text='3'>
                            Отправьте письмо другу или близкому человеку
                        </p>
                    </div>
                    <img src={`/layout/images/line.png`} width='100%' className='text__divider' height='2'/>
                    <div className='center'>
                        <p>Делая фото, постарайтесь использовать фантазию. Потому что ваш ждет конкурс на самую креативную фотографию! Авторы трех фото, набравших по итогам голосования на сайте самое большое количество лайков, становятся победителями и получают призы.</p>
                        {this.props.isLogin ?
                            <Link to='/games/present/make/' className='button button--small'>Отправить письмо</Link>
                            : <a href='#' onClick={this.openModal.bind(this)} className='button button--small'>Отправить письмо</a>}
                        <Link to='/games/present/gallery/' className='button button--small' style={{display: 'none'}}>Галерея работ</Link>
                        <br />
                        <a href='#' className='small'>Подробные условия акции</a>
                    </div>
                    <img src={`/layout/images/line.png`} width='100%' className='text__divider' height='2'/>
                    <div className='center'>
                        <h3 className='center'>Призы победителям</h3>
                        <div className='present__col'>
                            <span className='text__number' data-text='1'>
                                Место
                            </span>
                            <div className='present__item'>
                                <img src='http://164623.selcdn.com/russell/upload/products/aa8c09fbbe5590fe86276b9c.png' alt='' /><br/>
                                <span>Компактный гриль со съемными пластинами<br/><br/>20830-56</span>
                            </div>
                        </div>
                        <div className='present__col'>
                            <span className='text__number' data-text='2'>
                                Место
                            </span>
                            <div className='present__item'>
                                <img src='http://164623.selcdn.com/russell/layout/images/prizes/18663-56_Futura_Coffee_Maker_CO.png' alt='' /><br/>
                                <span>Кофеварка Futura<br/><br/>18663-56</span>
                            </div>
                        </div>
                        <div className='present__col'>
                            <span className='text__number' data-text='3'>
                                Место
                            </span>
                            <div className='present__item'>
                                <img src='http://164623.selcdn.com/russell/layout/images/prizes/18663-56_Futura_Coffee_Maker_CO.png' alt='' /><br/>
                                <span>Кофеварка Futura<br/><br/>18663-56</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    }
}


export default PresentDescription
