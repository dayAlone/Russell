import React, { Component } from 'react'
import Typograf from 'typograf'

import Carousel from './ui/Carousel'

import { connect } from 'react-redux'
import * as actionCreators from '../actions/recepts'
import { bindActionCreators } from 'redux'
import Spinner from './ui/Spinner'

@connect(state => ({ recepts: state.recepts.list }), dispatch => ({actions: bindActionCreators(actionCreators, dispatch)}))
class ShareLove extends Component {
    componentDidMount() {
        if (this.props.recepts.length === 0) {
            this.props.actions.getRecepts()
        }
    }
    render() {
        let tp = new Typograf({lang: 'ru'})
        return <div className='share-love'>
            <div className='share-love__title'>
                <img src='/layout/images/svg/title.svg' alt='' className='' />
            </div>
            {this.props.recepts.length > 0 ?
                <Carousel className='share-love__slider' slideToShow='5' responsive={true}>
                    {this.props.recepts.map((item, i) => {
                        const { name, preview, video } = item
                        return <a href='#' key={i} className='share-love__item' style={{backgroundImage: `url(${preview})`}}>
                            <div className='share-love__name'>{tp.execute(name)}</div>
                            {video ? <img src='/layout/images/svg/video.svg' className='share-love__icon' /> : false}
                        </a>
                    })}
                </Carousel>
                : <Spinner/>}

        </div>
    }
}

export default ShareLove

/*
<div className='share-love__action center'>
    <a href='#' className='button'>Все рецепты</a>
</div>
*/
