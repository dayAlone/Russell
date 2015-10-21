import React, { Component } from 'react';
import Helmet from 'react-helmet';
import Breadcrumbs from '../ui/Breadcrumbs';
import Title from '../layout/Title';
import ShareLove from '../ShareLove';

import { connect } from 'react-redux';

@connect(state => ({ stores: state.stores.list }))
class PageBuy extends Component {
    render() {
        let items = this.props.stores ?
            this.props.stores.map((el, i) => {
                let { image, link, color } = el;
                return <a key={i}
                            className='stores__item'
                            href={link}
                            target='_blank'
                            style={{
                                backgroundImage: `url(${image})`,
                                backgroundColor: color
                            }} />;
            }) : false
        return <div className='page page--stores'>
            <Helmet title={'Russell Hobbs | Где купить'}/>
            <Title />
            <Breadcrumbs routes={this.props.routes} />
            <div className='text'>
                <h2 className='page__title'>Где купить</h2>
            </div>
            <div className='stores'>
                {items}
            </div>
            <p>*Внимание: не все продукты Russell Hobbs могут быть доступны на складе</p>
            <ShareLove />
        </div>;
    }
}

export default PageBuy;
