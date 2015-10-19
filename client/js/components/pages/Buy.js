import React, { Component } from 'react';
import Helmet from 'react-helmet';
import Breadcrumbs from '../ui/Breadcrumbs';
import Title from '../layout/Title';
import ShareLove from '../ShareLove';


class PageCatalog extends Component {

    render() {
        return <div className='page'>
            <Helmet title={'Russell Hobbs | Где купить'}/>
            <Title />
            <Breadcrumbs routes={this.props.routes} />
            <ShareLove />
        </div>;
    }
}

export default PageCatalog;
