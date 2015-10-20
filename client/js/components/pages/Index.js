import React, { Component } from 'react';
import oid from '../../../../server/libs/oid';
import Helmet from 'react-helmet';

import Title from '../layout/Title';
import ShareLove from '../ShareLove';
import Categories from '../Categories';

import * as design from '../../actions/design';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

@connect(false, dispatch => ({design: bindActionCreators(design, dispatch)}))
class PageIndex extends Component {
    componentDidMount() {
        this.props.design.setLine(null)
    }
    render() {
        return <div className='page page--index'>
            <Helmet title='Russell Hobbs' />
            <Title type='big' />
            <Categories type='carousel' source='collections'>
                <div className='text'>
                    <h2>В cердце вашего дома</h2>
                    <p>Первая чашка кофе утром, тепло свежевыглаженной рубашки, улыбка удовольствия от аромата свежей выпечки – вот те моменты, которые действительно имеют значение, моменты истинной радости. Это уникальный опыт, который ежедневно создается продукцией Russell Hobbs.</p>
                    <p><strong>Мы - Russell Hobbs, в сердце Вашего дома.</strong></p>

                </div>
            </Categories>
            <ShareLove />
        </div>;
    }
}

export default PageIndex;
