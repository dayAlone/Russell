import React, { Component } from 'react';
import { connect } from 'react-redux';

import Header from '../components/layout/Header';
import Nav from '../components/layout/Nav';
import Footer from '../components/layout/Footer';

import * as design from '../actions/design';
import { bindActionCreators } from 'redux';

@connect(state => ({ line: state.design.line }), dispatch => ({design: bindActionCreators(design, dispatch)}))
class App extends Component {
    componentDidUpdate() {
        let path = this.props.location.pathname;
        if (path.indexOf('/catalog/categories/') === -1
            && path.indexOf('/catalog/product/') === -1
            && !path.match(/\/catalog\/collections\/(.*)\//)
            && this.props.line) {
            this.props.design.setLine(null)
        }
    }
    render() {
        return <div className='wrap'>
            <Header routes={this.props.location} />
            <Nav routes={this.props.location} />
            {this.props.children}
            <Footer />
        </div>;
    }
}

export default App;
