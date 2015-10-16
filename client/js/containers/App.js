import React, { Component } from 'react';
import { connect } from 'react-redux';

import Header from '../components/Header';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

@connect(state => ({ routerState: state.router }))
class App extends Component {
    render() {
        return <div className="wrap">
            <Header />
            <Nav />
            {this.props.children}

            <Footer />
        </div>;
    }
};

export default App;
