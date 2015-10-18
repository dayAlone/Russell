import React, { Component } from 'react';
//import { Link } from 'react-router';
import Modal from 'boron/ScaleModal';
import Login from '../Login';

import { connect } from 'react-redux';
@connect(state => ({ user: state.login.data, isLogin: state.login.isLogin }))
class Footer extends Component {
    state = {
        modalIsOpen: false
    }
    openModal(e) {
        e.preventDefault()
        this.refs.modal.show();
    }
    render() {
        let { isLogin } = this.props;
        let list = {
            fb: 'https://www.facebook.com/russellhobbsrussia',
            vk: 'https://vk.com/russelhobbsrussia',
            in: 'https://instagram.com/russellhobbsrussia/'
        };
        let socials = [];
        for (let id in list) {
            socials.push(<a href={list[id]} key={id} className={`social social--${id}`}>
                <img src={`/layout/images/svg/${id}.svg`} alt='' />
            </a>);
        }
        return <div className='footer'>
            <div className='footer__social center'>
                {socials}
            </div>
            <div className='footer__copyright'>
                <div className='footer__rules'>
                    {/*<Link to='/conditions/'>Условия проведения акции</Link>*/}
                    <br />
                </div>
                <div className='footer__spectrum'>
                    <img src='/layout/images/svg/spectrum.svg' />
                    <a onClick={this.openModal.bind(this)} href='#'>©</a>&nbsp;
                     2015 SPECTRUM BRANDS , INC., ALL RIGHTS RESERVED
                </div>
            </div>
            <Modal ref='modal' className='modal center'>
                <div className='modal__content'>
                    <h2 className='modal__title'>Вход на сайт</h2>
                    <Login />
                </div>
            </Modal>
        </div>;
    }
}

export default Footer;
