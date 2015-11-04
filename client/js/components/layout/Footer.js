import React, { Component } from 'react'
//import { Link } from 'react-router'
import ShareLove from '../ShareLove.js'

import { connect } from 'react-redux'
@connect(state => ({ modal: state.login.modal }))
class Footer extends Component {
    render() {
        let list = {
            fb: 'https://www.facebook.com/russellhobbsrussia',
            vk: 'https://vk.com/russelhobbsrussia',
            in: 'https://instagram.com/russellhobbsrussia/'
        }
        let socials = []
        for (let id in list) {
            socials.push(<a href={list[id]} key={id} className={`social social--${id}`}>
                <img src={`/layout/images/svg/${id}.svg`} alt='' />
            </a>)
        }
        let path = this.props.routes.pathname
        return <div>
            {path.indexOf('profile') === -1 && path.indexOf('games/') === -1 ? <ShareLove routes={this.props.routes} /> : null}
            <div className='footer'>
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

                        <div className='footer__text'>© 2015 SPECTRUM BRANDS, INC.,<br/> ALL RIGHTS RESERVED</div>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default Footer
