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

                    <p className='center'>Выбирать подарок – это не просто. Мы поможем вам облегчить этот процесс для ваших близких и друзей. <br/>Выберите модель техники Russell Hobbs, которую вы бы хотели получить в качестве подарка. И мы намекнем об этом вашим близким и друзьям.<br/>При этом вы можете проявить фантазию. Авторы трех самых креативных «намеков» получат призы от Russell Hobbs.<br/>Итак, что нужно сделать, чтобы получить от друзей в подарок технику Russell Hobbs, а потом еще и выиграть приз?</p>
                    <div className='present__col'>
                        <p className='text__number' data-text='1'>
                            С помощью специальной формы на странице акции начать создавать письмо другу.
                        </p>
                    </div>
                    <div className='present__col'>
                        <p className='text__number' data-text='2'>
                            Выбрать технику Russell Hobbs из каталога.
                        </p>
                    </div>
                    <div className='present__col'>
                        <p className='text__number' data-text='3'>
                            Загрузить свою фотографию, где вы демонстрируете ваше желание получить в подарок технику. Вставить фото в шаблон письма рядом с изображением техники.
                        </p>
                    </div>
                    <div className='present__col'>
                        <p className='text__number' data-text='4'>
                            Указать электронный адрес друга, а также его и свое имена, которые будут вставлены в письмо.
                        </p>
                    </div>
                    <div className='present__col'>
                        <p className='text__number' data-text='5'>
                            Отправить письмо и ждать подарка от друга и приза от Russell Hobbs.
                        </p>
                    </div>
                    <h3 className='center'>Время проведения акции – с 23 ноября по 30 декабря.</h3>
                    <div className='center'>

                        {this.props.isLogin ?
                            <Link to='/games/present/make/' className='button button--small'>Принять участие</Link>
                            : <a href='#' onClick={this.openModal.bind(this)} className='button button--small'>Принять участие</a>}
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
            </div>
    }
}


export default PresentDescription
