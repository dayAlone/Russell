import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import 'moment/locale/ru';
import { Link } from 'react-router';
import Countdown from './Countdown';

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
                        <img src="/layout/images/header.jpg" width="100%" className='title__image'/>
                        <div className="title__question">Вы мечтаете о стильной технике для кухни?</div>
                        <div className="title__products"><img src={image} /></div>
                        <div className="title__description">
                            <p dangerouslySetInnerHTML={{__html: description}} />
                        </div>
                        {this.props.type === 'counter' ? <div className="title__counter">
                            <Countdown dateStart={dateStart} dateStop={dateStop} link={link} />
                        </div> : false}
                        <div className="title__actions">
                            {this.props.type !== 'counter' ? <Link to="/games/" className="button button--big">Выиграть!</Link> : false }
                        </div>
                    </div>;
                break;
            default:
                content = <div>
                    <img src="/layout/images/header-small.jpg" width="100%" className='title__image'/>
                </div>;
        }
        return <div className={`title ${this.props.type ? `title--${this.props.type}`:''}`}>
            <img src="/layout/images/svg/love.svg" className="title__love" />
            {content}
            <img src="/layout/images/line.png" width="100%" className="title__line" />
        </div>;
    }
}

export default Title;
