import React, { Component } from 'react';
import UserInfo from '../UserInfo';
import { Link } from 'react-router';
import Modal from 'boron/ScaleModal';

class Header extends Component {
    openModal(e) {
        e.preventDefault()
        this.refs.modal.show();
    }
    render() {
        return <div>
                <div className='header'>
                    <div className='header__col'>
                        <Link to='/' className='header__logo'>
                            <img src={`/layout/images/svg/logo.svg`} />
                        </Link>
                    </div>
                    <div className='header__col right'>
                        <a href='#' onClick={this.openModal.bind(this)}><img src={`/layout/images/svg/title-description.svg`} className='header__title' /></a>
                    </div>
                    <UserInfo />
                </div>
                <Modal ref='modal' className='modal'>
                    <div className='modal__content'>
                        <div className='text'>
                            <h2 class='modal__title'>Share the <img src='/layout/images/svg/heart.svg' width='30' /></h2>
                            <p>Кто сказал, что от добра добра не ищут? Мы, Russell Hobbs, занимаемся этим вот уже больше 60 лет, и не только ищем, но и находим.</p>
                            <p>Например, что может быть проще и удобней электрического чайника? Но мы взяли и создали первый чайник, который автоматическим отключался после закипани.</p>
                            <p>Так же и с людьми. Вокруг много хороших людей, но мы решили найти и показать всем реальные факты, наглядно демонстрирующие масштаб людской доброты.</p>
                            <p>И мы сделали это. Взяли и нашли множество жизненных историй, рассказывающих, как люди помогают друг другу просто потому, что они люди. Посмотрите их, пожалуйста.</p>
                            <p>В жизни всегда есть место доброте и человечности. Давайте поделимся ими друг с другом. Приглашаем вас в путешествие, от добра к добру, от сердца к сердцу.</p>
                            <p><strong>Ваш Russell Hobbs</strong></p>
                        </div>
                    </div>
                </Modal>
        </div>;
    }
}

export default Header;
