import React, { Component } from 'react';
import Typograf from 'typograf';
import Carousel from './Carousel';

class ShareLove extends Component {
    state = {
        items: [
            {
                name: 'Название галереи',
                author: 'Константин',
                city: 'Москва',
                thumb: '/layout/images/share-1.jpg',
                type: 'photo',
                photos: []
            },
            {
                name: 'Название галереи в две строки',
                author: 'Александра',
                city: 'Санкт-Петербург',
                thumb: '/layout/images/share-2.jpg',
                type: 'video',
                video: ''
            },
            {
                name: 'Название галереи',
                author: 'Вениамин',
                city: 'Комсомольск-на-Амуре',
                thumb: '/layout/images/share-3.jpg',
                type: 'photo',
                photos: []
            },
            {
                name: 'Название галереи может быть и в три строки',
                author: 'Константин',
                city: 'Москва',
                thumb: '/layout/images/share-4.jpg',
                type: 'video',
                video: ''
            },
            {
                name: 'Название галереи',
                author: 'Александр',
                city: 'Санкт-Петербург',
                thumb: '/layout/images/share-5.jpg',
                type: 'photo',
                photos: []
            },
            {
                name: 'Название галереи',
                author: 'Александр',
                city: 'Санкт-Петербург',
                thumb: '/layout/images/share-1.jpg',
                type: 'photo',
                photos: []
            }
        ]
    }
    render() {
        let tp = new Typograf({lang: 'ru'});
        return false;
        return <div className='share-love'>
            <img src='/layout/images/svg/title.svg' alt='' className='share-love__title' />
            <Carousel className='share-love__slider' slideToShow='5'>
                {this.state.items.map((item, i) => {
                    const { name, author, city, thumb, type, photos, video } = item;
                    return <a href='#' key={i} className='share-love__item' style={{backgroundImage: `url(${thumb})`}}>
                        <div className='share-love__name'>{tp.execute(name)}</div>
                        <div className='share-love__author'>{author}{city ? ',' : false} <nobr>{city}</nobr></div>
                        {type === 'video' ? <img src='/layout/images/svg/video.svg' className='share-love__icon' /> : false}
                    </a>;
                })}
            </Carousel>
            <div className="share-love__action center">
                <a href="#" className="button">Все рецепты</a>
            </div>
        </div>;
    }
}

export default ShareLove;
