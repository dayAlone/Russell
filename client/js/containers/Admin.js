import React, { Component } from 'react'
import { connect } from 'react-redux'

import Header from '../components/layout/HeaderAdmin'
import { IndexLink, Link } from 'react-router'

@connect(state => ({isLogin: state.login.isLogin}))

class Admin extends Component {
    componentDidMount() {
        $('body').addClass('admin')
    }
    componentWillUnmount() {
        $('body').removeClass('admin')
    }
    componentDidUpdate() {
        if (!this.props.isLogin) location.href = '/'
    }
    render() {
        return <div>
            <Header routes={this.props.location} />
            <div className='wrap'>
                <div className='page page--admin'>
                    <div className='text text--black'>
                        <div className='admin__nav'>
                            {[
                                {name: 'Чеки', link: '/admin/'}
                            ].map((el, i) => {
                                if (i === 0 && this.props.location.pathname !== '/admin/') {
                                    return <IndexLink key={i} to='/admin/' className='admin__link' activeClassName='admin__link--active'>Общая информация</IndexLink>
                                }
                                return <Link key={i} to={el.link} className='admin__link' activeClassName='admin__link--active'>{el.name}</Link>
                            })}
                        </div>
                        {this.props.children}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default Admin
