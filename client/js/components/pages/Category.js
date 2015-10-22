import React, { Component } from 'react'
import Title from '../layout/Title'
import ShareLove from '../ShareLove'
import Products from '../Products'
class PageCatalog extends Component {

    render() {
        return <div className='page page--categories'>
            <Title />

            <Products code={this.props.routeParams.code} source={this.props.route.source} routes={this.props.routes}/>
            <ShareLove />
        </div>
    }
}

export default PageCatalog
