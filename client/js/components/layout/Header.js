import React, { Component } from 'react'
import UserInfo from '../UserInfo'
import { Link } from 'react-router'
import Modal from '../ui/Modal'
import Nav from './MobileNav'

import Social from '../ui/Social'
class Header extends Component {
    openModal(e) {
        e.preventDefault()
        this.refs.modal.show()
    }
    openNav(e) {
        e.preventDefault()
        this.refs.nav.show()
    }
    closeNav(e) {
        if (e) e.preventDefault()
        this.refs.nav.hide()
    }
    componentDidUpdate() {
        this.refs.nav.hide()
    }
    render() {
        return <div>

                <div className='header header--desktop'>
                    
                    <div>
                        <div className='header__col'>
                            <Link to='/' className='header__logo'>
                                <img src={`/layout/images/svg/logo.svg`} />
                            </Link>
                        </div>
                        <div className='header__col right'>
                            <a href='#' onClick={this.openModal.bind(this)}><img src={`/layout/images/svg/title-description-mobile.svg`} className='header__title' /></a>
                        </div>
                        <UserInfo />
                    </div>
                </div>
                <div className='header header--mobile'>
                    <div className='header__col'>
                        <Link to='/' className='header__logo'>
                            <img src={`/layout/images/svg/logo-mobile.svg`} />
                        </Link>
                    </div>
                    <div className='header__col center'>
                        <a href='#' onClick={this.openModal.bind(this)}><img src={`/layout/images/svg/title-description-mobile.svg`} className='header__title' /></a>

                    </div>
                    <div className='header__col right'>
                        <a href='#' onClick={this.openNav.bind(this)} className='nav-trigger'><img src='/layout/images/svg/nav.svg' alt='' /></a>
                    </div>
                </div>
                <Modal ref='nav' className='modal modal--nav'>
                    <a href='#' className='modal__close' onClick={this.closeNav.bind(this)}><img src='/layout/images/svg/close.svg' alt='' width='20'/></a>
                    <Nav closeNav={this.closeNav.bind(this)}/>
                </Modal>
                <Modal ref='modal' className='modal'>
                    <div className='text'>
                        <h2 className='modal__title'>Share the <img src='/layout/images/svg/heart.svg' width='26' /></h2>
                        <p>Кто сказал, что от добра добра не ищут? Мы, Russell Hobbs, занимаемся этим вот уже больше 60 лет, и не только ищем, но и находим.</p>
                        <p>Например, что может быть проще и удобней электрического чайника? Но мы взяли и создали первый чайник, который автоматическим отключался после закипания.</p>
                        <p>Так же и с людьми. Вокруг много хороших людей, но мы решили найти и показать всем реальные факты, наглядно демонстрирующие масштаб людской доброты.</p>
                        <p>И мы сделали это. Взяли и нашли множество жизненных историй, рассказывающих, как люди помогают друг другу просто потому, что они люди. И разместили эти истории в наших сообществах в социальных сетях. Посмотрите их, пожалуйста:</p>
                        <div className='header__social center'>
                            <Social/>
                        </div>
                        <p>В жизни всегда есть место доброте и человечности. Давайте поделимся ими друг с другом. Приглашаем вас в путешествие, от добра к добру, от сердца к сердцу.</p>
                        <p><strong>Ваш Russell Hobbs</strong></p>
                    </div>
                </Modal>
        </div>
    }
}

export default Header
