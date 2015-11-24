import React, { Component } from 'react'
import { connect } from 'react-redux'
import LoginEmail from '../components/LoginEmail'
import Header from '../components/layout/HeaderAdmin'
import { IndexLink, Link } from 'react-router'
import AuthModal from '../components/modals/Auth'

@connect(state => ({isLogin: state.login.isLogin, user: state.login.data}))

class Admin extends Component {
    componentDidMount() {
        $('body').addClass('admin')
        this.permissionCheck()
    }
    componentWillUnmount() {
        $('body').removeClass('admin')
    }
    componentDidUpdate() {
        this.permissionCheck()
    }
    permissionCheck() {
        if (this.props.isLogin && this.props.user.role !== 'admin') {
            location.href = '/'
        }
    }
    render() {
        return <div>
            <Header routes={this.props.location} />
            <div className='wrap'>
                <div className='page page--admin'>
                    <div className='text text--black'>
                        { this.props.isLogin ? <div>
                            <div className='admin__nav'>
                                {[
                                    {name: 'Чеки', link: '/admin/'},
                                    {name: 'Победители', link: '/admin/winners/'},
                                    {name: 'Фото', link: '/admin/presents/'},
                                    {name: 'Розыгрыш', link: '/admin/competitions/'},
                                ].map((el, i) => {
                                    if (i === 0 && this.props.location.pathname !== '/admin/') {
                                        return <IndexLink key={i} to='/admin/' className='admin__link' activeClassName='admin__link--active'>Чеки</IndexLink>
                                    }
                                    return <Link key={i} to={el.link} className='admin__link' activeClassName='admin__link--active'>{el.name}</Link>
                                })}
                            </div>
                            {this.props.children}
                        </div> : <div className='form form--auth'><LoginEmail/></div> }
                    </div>
                </div>
            </div>
            <AuthModal />
        </div>
    }
}

export default Admin
