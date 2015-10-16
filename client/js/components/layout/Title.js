import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import moment from 'moment';
import 'moment/locale/ru';

import Countdown from '../ui/Countdown';

@connect(state => ({ game: state.games.list[0] }))
class Title extends Component {
    static defaultProps = { type: 'small' }
    render() {
        let content = '';
        let { image, dateStart, dateStop, description, link } = this.props.game;
        let start = moment(dateStart, 'DD.MM.YYYY').format('D MMMM');
        let end = moment(dateStop, 'DD.MM.YYYY').format('D MMMM');
        description = description.replace('#start#', start).replace('#end#', end)

        switch (this.props.type) {
            case 'counter':
            case 'big':
                    content = <div>
                        <img src='/layout/images/header.jpg' width='100%' height='322' className='title__image'/>
                        <div className='title__question'>Вы мечтаете о стильной технике для кухни?</div>
                        <div className='title__products'><img src={image} /></div>
                        <div className='title__description'>
                            <p dangerouslySetInnerHTML={{__html: description}} />
                        </div>
                        {this.props.type === 'counter' ? <div className='title__counter'>
                            <Countdown dateStart={dateStart} dateStop={dateStop} link={link} hideButton={true}/>
                        </div> : false}
                        <div className='title__actions'>
                            {this.props.type !== 'counter' ? <Link to='/games/' className='button button--big'>Выиграть!</Link> : false }
                        </div>
                    </div>;
                break;
            default:
                content = <Link to='/games/'><img src='/layout/images/header-small.jpg' width='100%' className='title__image' height='162'/></Link>;
        }
        return <div className={`title ${this.props.type ? `title--${this.props.type}`:''}`}>
            <img src='/layout/images/svg/love.svg' height='29' className='title__love' />
            {content}
            <img src='/layout/images/line.png' width='100%' className='title__line' height='2'/>
        </div>;
    }
}

export default Title;
