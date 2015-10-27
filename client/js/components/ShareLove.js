import React, { Component } from 'react'
import Typograf from 'typograf'
import { FacebookButton, TwitterButton, VKontakteButton } from 'react-social'

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
        this.checkModal()
    }
    componentDidUpdate(prevProps) {
        if (prevProps.recepts.length === 0) this.checkModal()
    }
    checkModal() {
        let recept = this.props.routes.query.recept
        let recepts = this.props.recepts
        if (recept && recepts.length > 0) {
            recepts.forEach((el, i) => {
                if (el._id === recept) {
                    console.log(this.openModal(i)(false))
                }
            })
        }
    }
    openModal(i) {
        let { name, description, preview, video, _id } = this.props.recepts[i]
        let url = `http://${document.domain}/?recept=${_id}`
        let modalContent = <div>
            <div className={`recept  ${video ? 'recept--video' : ''}`}>
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
                    <a href='#' className='modal__close' onClick={this.closeModal.bind(this)}><img src='/layout/images/svg/close.svg' alt='' /></a>
                    {video ? <h4 className='recept__name'>{name}</h4> : false }
                    <p>{description}</p>
                    <div className='recept__share'>
                        <FacebookButton url={url}> <img src='/layout/images/svg/fb.svg' alt='' /></FacebookButton>
                        <VKontakteButton url={url}> <img src='/layout/images/svg/vk.svg' alt='' /></VKontakteButton>
                    </div>
                </div>
            </div>

        </div>
        return (e) => {
            this.setState({modalContent: modalContent})
            this.refs.modal.show()
            if (e) e.preventDefault()
        }
    }
    closeModal(e) {
        this.refs.modal.hide()
        this.setState({modalContent: false})
        e.preventDefault()
    }
    render() {
        let tp = new Typograf({lang: 'ru'})
        return this.props.recepts.length > 0 ? <div>
                <div className='share-love'>
                    <div className='share-love__title'>
                        <img src='/layout/images/svg/title.svg' alt='' className='' />
                    </div>
                    <Carousel className='share-love__slider' slideToShow='5' responsive={true}>
                        {this.props.recepts.map((item, i) => {
                            const { name, preview, video } = item
                            return <div key={i}><a href='#' onClick={this.openModal(i)} className='share-love__item' style={{backgroundImage: `url(${preview})`}}>
                                <div className='share-love__name'>{tp.execute(name)}</div>
                                {video ? <img src='/layout/images/svg/video.svg' className='share-love__icon' /> : false}
                            </a></div>
                        })}
                    </Carousel>
                </div>
                <Modal ref='modal' className='modal modal--recept'>
                    {this.state.modalContent}
                </Modal>
            </div> : <Spinner/>
    }
}

export default ShareLove

/*
<div className='share-love__action center'>
    <a href='#' className='button'>Все рецепты</a>
</div>
*/
