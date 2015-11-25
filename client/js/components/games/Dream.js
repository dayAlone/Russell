import React, { Component } from 'react'
import { connect } from 'react-redux'
import Title from '../layout/Title'

import { Link } from 'react-router'
import * as actionCreators from '../../actions/login'
import { bindActionCreators } from 'redux'

@connect(state => ({isLogin: state.login.isLogin}), dispatch => ({actions: bindActionCreators(actionCreators, dispatch)}))
class Dream extends Component {
    state = {more: false}
    toggleMore(status) {
        return (e) => {
            this.setState({more: status})
            e.preventDefault()
        }
    }
    openModal(e) {
        const { openModal } = this.props.actions
        openModal()
        e.preventDefault()
    }
    componentDidMount() {
        (window.Image ? (new Image()) : document.createElement('img')).src = location.protocol + '//vk.com/rtrg?r=Fj1uTj08NP*2HhNOZRXYaXPRqd6LQx7gdiwJZ41GmCCLOHsNDHgf10KsTi/nRPksosF6cxt8P2Rn4m*mvgksp6QnVtaLOfCqjqhzjDW9YUiaZegMPQ/54CXBC3GvFvJhcBcpDNH79Hn8lVZURIVLDDfuvi/mWkIw4KW*yHe58fw-'
    }
    render() {
        return <div className='dream'>
            <Title type='short'/>
            <div className='text'>
                <h2>Добро пожаловать в мир, где сбываются мечты об идеальном доме!</h2>
                <p>Что делает реальность похожей на мечту? Отношение. Мы вкладываем в нашу технику лучшие чувства, чтобы она помогала вам делиться любовью с близкими.</p>
                <p>Коллекция Illumina – это воплощение нашей мечты об элегантности и инновационности. И вы можете ее выиграть! Как и множество другой техники Russell Hobbs.</p>
                <img src={`/layout/images/line.png`} width='100%' className='text__divider' height='2'/>
                <h3 className='center'>Итак, что нужно, чтобы участвовать в акции?</h3>
                <section>
                    <div className='text__col'>
                        <p className='text__number' data-text='1'>Если вы впервые зашли на наш сайт, вам нужно {this.props.isLogin ? <Link to='/profile/checks/'>зарегистрироваться</Link> : <a onClick={this.openModal.bind(this)} href='#'>зарегистрироваться</a>}.</p>
                    </div>
                    <div className='text__col'>
                        <p className='text__number' data-text='2'>Приобрести любую технику Russell Hobbs, в любом количестве, и сохранить чеки от покупок.</p>
                    </div>
                    <div className='text__col'>
                        <p className='text__number' data-text='3'>Зарегистрировать чеки на нашем сайте, в вашем Личном кабинете. Регистрация чеков начинается 6 ноября.</p>
                    </div>
                    <div className='text__col'>
                        <p className='text__number' data-text='4'>Выбрать предмет, который вы хотите получить в качестве приза, в каталоге призов.</p>
                    </div>
                    <div className='text__col'>
                        <p className='text__number' data-text='5'>Сохранять чек, упаковочную коробку и приобретенный предмет техники вплоть до получения приза.</p>
                    </div>
                    <div className='text__col'>
                        <p className='text__number' data-text='6'>Также для участия в акции Вам нужно подписаться на наши группы в социальных сетях <a href='https://www.facebook.com/russellhobbsrussia' target='_blank'>Facebook</a>, <a href='https://vk.com/russellhobbsrus' target='_blank'>Вконтакте</a>, <a href='https://instagram.com/russellhobbsrussia/' target='blank'>Instagram</a>.</p>
                    </div>
                </section>
                <h3 className='center'>Время проведения акции – с 12 октября по 28 декабря.</h3>
                <img src={`/layout/images/line.png`} width='100%' className='text__divider' height='2'/>
                <div className='center'>
                    {this.props.isLogin ? <Link to='/profile/checks/' className='button'>Принять участие</Link> : <a onClick={this.openModal.bind(this)} href='#' className='button'>Принять участие</a>}<br/>
                { this.state.more ? null : <span><a href='#' onClick={this.toggleMore(true)}>Подробнее</a><br/><small><a href='http://164623.selcdn.com/russell/rules/Vyigray_mechtu_rules.pdf' target='_blank'>Условия и правила проведения акции</a></small></span> }
                </div>
                { this.state.more ? <div className='dream__more'>
                    <p>В акции могут участвовать чеки от покупок, сделанных в период с 12 октября по 27 декабря.</p>
                    <p>Для регистрации чеков необходимо прислать фотографию чека с легко прочитываемыми данными и фотографию приобретенного предмета техники Russell Hobbs. Для этого вам нужно воспользоваться вкладкой «Мои чеки» в вашем Личном кабинете.</p>
                    <p>Розыгрыш проводится среди уникальных номеров, присвоенных чекам. Каждый чек – это ваш шанс выиграть в розыгрыше, т.е. 1 чек – 1 шанс.</p>
                    <p>Каждая единица техники в чеке дает право выбрать один предмет в каталоге, соответственно, если у вас в чеке 2 единицы техники, вы можете выбрать 2 предмета в каталоге, 3 единицы – 3 предмета, и т. д. Выбирать предметы вы можете с 6 ноября.</p>
                    <h3 className='center'>Розыгрыш проводится в 2 этапа.</h3>
                    <section>
                        <div className='text__col'>
                            <p><strong>1 этап</strong> – это розыгрыш суперприза, коллекции Illumina. Победитель выбирается случайным образом среди уникальных номеров, соответствующих зарегистрированным чекам.</p>
                        </div>
                        <div className='text__col'>
                            <p><strong>2 этап</strong> – проведение розыгрыша среди оставшихся после 1 этапа остальных уникальных номеров, соответствующих зарегистрированным чекам.</p>
                        </div>
                    </section>
                    <h3 className='center'>Розыгрыши проводятся 14, 21 и 28 декабря 2015 года.</h3>
                    <section>
                        <div className='text__col text__col--small'>
                            <p>Чтобы принять участие в розыгрыше 14 декабря, вам нужно зарегистрировать ваш чек до 13 декабря включительно. </p>
                        </div>
                        <div className='text__col text__col--small'>
                            <p>Чтобы принять участие в розыгрыше 21 декабря, вам нужно зарегистрировать ваш чек до 20 декабря включительно.</p>
                        </div>
                        <div className='text__col text__col--small'>
                            <p>Чтобы принять участие в розыгрыше 28 декабря, вам нужно зарегистрировать ваш чек до 27 декабря включительно.</p>
                        </div>
                    </section>
                    <p>После определения победителей каждого розыгрыша, победителю необходимо разместить свои контактные данные в его Личном кабинете на нашем сайте, для получения к ним доступа администратора акции.</p>


                    <div className='center'>
                        <p><a href='#' onClick={this.toggleMore(false)}><a href='#'>Свернуть</a></a></p>
                    </div>
                </div> : null}
            </div>
        </div>
    }
}
export default Dream
