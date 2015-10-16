import React, { Component } from 'react';
import Title from './Title';
import ShareLove from './ShareLove';
import Products from './Products';
class PageCatalog extends Component {

    render() {
        return <div className='page'>
            <Title />

            <Products code={this.props.routeParams.code} source={this.props.route.source} routes={this.props.routes}/>
            <ShareLove />
        </div>;
    }
}

export default PageCatalog;
