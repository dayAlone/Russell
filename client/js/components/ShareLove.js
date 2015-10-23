import React, { Component } from 'react'
import Typograf from 'typograf'

import Carousel from './ui/Carousel'
import Spinner from './ui/Spinner'
import Modal from './ui/Modal'

import { connect } from 'react-redux'
import * as actionCreators from '../actions/recepts'
import { bindActionCreators } from 'redux'


@connect(state => ({ recepts: state.recepts.list }), dispatch => ({actions: bindActionCreators(actionCreators, dispatch)}))
class ShareLove extends Component {
    state = {modalContent: false}
    componentDidMount() {
        if (this.props.recepts.length === 0) {
            this.props.actions.getRecepts()
        }
    }
    openModal(i) {
        let { name, description, preview, video } = this.props.recepts[i]
        let modalContent = <div>
            <div className={`recept  ${video ? 'recept--video' : ''}`}>
                <a href='#' className='modal__close' onClick={this.closeModal.bind(this)}><img src='/layout/images/svg/close.svg' alt='' /></a>
                {video ?
                    <div className='recept__video'>
                        <iframe width='640' height='360' src={`https://www.youtube.com/embed/${video}`} frameBorder='0' allowFullScreen='' />
                    </div>
                    :
                    <div className='recept__image' style={{backgroundImage: `url(${preview})`}}>
                        <h4 className='recept__name'>{name}</h4>
                    </div>
                }
                <div className='recept__content'>
                    {video ? <h4 className='recept__name'>{name}</h4> : false }
                    <p>{description}</p>
                </div>
            </div>

        </div>
        return (e) => {
            this.setState({modalContent: modalContent})
            this.refs.modal.show()
            e.preventDefault()
        }
    }
    closeModal(e) {
        this.refs.modal.hide()
        this.setState({modalContent: false})
        e.preventDefault()
    }
    render() {
        let tp = new Typograf({lang: 'ru'})
        return <div className='share-love'>
            <div className='share-love__title'>
                <img src='/layout/images/svg/title.svg' alt='' className='' />
            </div>
            {this.props.recepts.length > 0 ?
                <div>
                    <Carousel className='share-love__slider' slideToShow='5' responsive={true}>
                        {this.props.recepts.map((item, i) => {
                            const { name, preview, video } = item
                            return <a href='#' onClick={this.openModal(i)} key={i} className='share-love__item' style={{backgroundImage: `url(${preview})`}}>
                                <div className='share-love__name'>{tp.execute(name)}</div>
                                {video ? <img src='/layout/images/svg/video.svg' className='share-love__icon' /> : false}
                            </a>
                        })}
                    </Carousel>
                    <Modal ref='modal' className='modal modal--recept'>
                        {this.state.modalContent}
                    </Modal>
                </div> : <Spinner/>}

        </div>
    }
}

export default ShareLove

/*
<div className='share-love__action center'>
    <a href='#' className='button'>Все рецепты</a>
</div>
*/
