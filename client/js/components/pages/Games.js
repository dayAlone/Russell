import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import moment from 'moment';
import 'moment/locale/ru';

import Title from '../layout/Title';
import ShareLove from '../ShareLove';
import Countdown from '../ui/Countdown';

import * as design from '../../actions/design';
import { bindActionCreators } from 'redux';

@connect(state => ({ games: state.games.list }), dispatch => ({design: bindActionCreators(design, dispatch)}))
class PageGames extends Component {
    componentDidMount() {
        this.props.design.setLine(null)
    }
    render() {
        const games = this.props.games.map((el, i) => {

            let { title, description, dateStart, dateStop, image, link, flag } = el;
            let start = moment(dateStart, 'DD.MM.YYYY').format('D MMMM');
            let end = moment(dateStop, 'DD.MM.YYYY').format('D MMMM');
            description = description.replace('#start#', start).replace('#end#', end);

            if (i > 0) {
                return <div key={i} className='game'>
                    <div className='game__content'>
                        <h2 className='game__title'>{title}</h2>
                        <div className='game__description' dangerouslySetInnerHTML={{__html: description}} />
                        <Countdown dateStart={dateStart} dateStop={dateStop} link={link} />
                    </div>
                    <div className='game__image right'>
                        <div className='game__flag'>{flag}</div>
                        <img src={image} alt='' />
                    </div>
                    <img src='/layout/images/line.png' width='100%' className='game__line' />
                </div>;
            }
        });
        return <div className='page page--index'>
            <Helmet title={'Russell Hobbs | Выиграй мечту!'}/>
            <Title type='counter' />
            <div className='games'>{games}</div>
            <ShareLove />

        </div>;
    }
}

export default PageGames;
