import React, { Component } from 'react'
import { connect } from 'react-redux'
import Title from '../layout/Title'

import { Link } from 'react-router'
import * as actionCreators from '../../actions/login'
import { bindActionCreators } from 'redux'


class PresentDescription extends Component {
    render() {
        return <div className='present__description text'>
                <p className='center'>Техника Russell Hobbs - отличный подарок!<br/>Мы поможем намекнуть вашим близким, что они могли бы подарить вам на Новый год.<br/>Как? Да очень просто! </p>
                <div className='present__col'>
                    <p className='text__number' data-text='1'>
                        Выберите технику, какую бы вы хотели получить в подарок
                    </p>
                </div>
                <div className='present__col'>
                    <p className='text__number' data-text='2'>
                        Загрузите свое фото в специальный шаблон
                    </p>
                </div>
                <div className='present__col'>
                    <p className='text__number' data-text='3'>
                        Отправьте письмо близкому человеку или другу
                    </p>
                </div>
                <img src={`/layout/images/line.png`} width='100%' className='text__divider' height='2'/>
                <div className='center'>
                    <p>Кроме того, ваше фото будет участвовать в конкурсе самых креативных фотографий. <br/>3 Самых креативных решения по итогам голосования на сайте получат призы от компании Russell Hobbs.</p>
                    <a href='#' className='button button--small'>Отправить письмо</a>
                    <a href='#' className='button button--small'>Галерея работ</a>
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
                            <img src='http://164623.selcdn.com/russell/upload/products/0abc0ff15e44d27f09daca5b.png' alt='' /><br/>
                            <span>Кухонный комбайн Illumina<br/><br/>20240-56</span>
                        </div>
                    </div>
                    <div className='present__col'>
                        <span className='text__number' data-text='2'>
                            Место
                        </span>
                        <div className='present__item'>
                            <img src='http://164623.selcdn.com/russell/upload/products/112ad7942078982fd9669900.png' alt='' /><br/>
                            <span>Чайник Clarity с системой фильтрации воды<br/><br/>20760-70</span>
                        </div>
                    </div>
                    <div className='present__col'>
                        <span className='text__number' data-text='3'>
                            Место
                        </span>
                        <div className='present__item'>
                            <img src='http://164623.selcdn.com/russell/upload/products/b078522bb2d3a631123b5c9b.png' alt='' /><br/>
                            <span>Погружной  блендер Illumina<br/><br/>20210-56</span>
                        </div>
                    </div>
                </div>

            </div>
    }
}

@connect(state => ({isLogin: state.login.isLogin}), dispatch => ({actions: bindActionCreators(actionCreators, dispatch)}))
class Present extends Component {
    openModal(e) {
        const { openModal } = this.props.actions
        openModal()
        e.preventDefault()
    }
    render() {
        return <div className='present'>
                <h2>В подарок. Для себя</h2>
                <PresentDescription/>
            </div>
    }
}
export default Present
