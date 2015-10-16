import React, { Component } from 'react';
import Title from './Title';
import ShareLove from '../components/ShareLove';
import Products from '../components/Products';

class PageCatalog extends Component {
    render() {
        return <div className='page'>
            <Title />
            <Products code={this.props.routeParams.code} source={this.props.route.source}/>
            <ShareLove />
        </div>;
    }
}

export default PageCatalog;
