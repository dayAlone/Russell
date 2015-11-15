import React, { Component } from 'react'
import { connect } from 'react-redux'

import Header from '../components/layout/Header'
import Nav from '../components/layout/Nav'
import Footer from '../components/layout/Footer'
import AuthModal from '../components/modals/Auth'

import * as design from '../actions/design'
import * as login from '../actions/login'
import { bindActionCreators } from 'redux'

import 'css_browser_selector'

@connect(state => ({ line: state.design.line }), dispatch => ({design: bindActionCreators(design, dispatch), login: bindActionCreators(login, dispatch)}))
class App extends Component {
    componentDidUpdate() {
        let path = this.props.location.pathname
        if (path.indexOf('/catalog/categories/') === -1
            && path.indexOf('/catalog/product/') === -1
            && !path.match(/\/catalog\/collections\/(.*)\//)
            && this.props.line) {
            this.props.design.setLine(null)
        }
    }
    componentDidMount() {
        let {confirm} = this.props.location.query
        if (confirm) {
            console.log(confirm)
            $.post('/auth/local/confirm-email/', { confirm: confirm, isNew: true }).done(response => {
                if (!response.error) {
                    this.props.login.openModal('confirm')
                }
            })
        }
    }
    render() {
        return <div className='wrap'>
            <Header routes={this.props.location} />
            <Nav routes={this.props.location} />
            {this.props.children}
            <Footer routes={this.props.location} />
            <AuthModal />
        </div>
    }
}

export default App
