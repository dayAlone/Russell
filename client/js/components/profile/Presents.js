import React, { Component } from 'react'
import Helmet from 'react-helmet'
import { Link } from 'react-router'
import Spinner from '../ui/Spinner'

import { bindActionCreators } from 'redux'
import * as actionCreators from '../../actions/profile'
import { connect } from 'react-redux'

@connect(state => ({presents: state.profile.presents}), dispatch => ({actions: bindActionCreators(actionCreators, dispatch)}))
class ProfileIndex extends Component {
    componentDidMount() {
        if (!this.props.presents) this.props.actions.getPresents()
    }
    render() {
        let { presents } = this.props
        return <div>
            <Helmet title='Russell Hobbs | Личный кабинет | Мои фото'/>
            <div className='presents'>
                {presents ? presents.map((el, i) => {
                    let status_text = ''
                    switch (el.status) {
                    case 'active':
                        status_text = 'Активен'
                        break
                    case 'canceled':
                        status_text = 'Отклонен'
                        break
                    default:
                        status_text = 'На модерации'
                    }
                    return <div className='presents__item'>
                        <div className='presents__image' style={{backgroundImage: `url(${el.image})`}}></div>
                        <div className='presents__likes'>
                            <img src='/layout/images/svg/heart-border.svg' width='18' alt='' /> {el.likes.length}
                        </div>
                        <div className={`presents__status presents__status--${el.status}`}>{status_text}</div>
                    </div>
                }) : <Spinner/>}
            </div>
            <div className='center'>
                <img src='/layout/images/mail-line.jpg' alt='' width='100%'/>
                <Link to='/games/present/make/' className='button button--small'>Добавить фото</Link>
            </div>
        </div>
    }
}

export default ProfileIndex
