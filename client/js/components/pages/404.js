import React, { Component } from 'react'
import Title from '../layout/Title'
import { Link } from 'react-router'

import { connect } from 'react-redux'
import * as design from '../../actions/design'
import { bindActionCreators } from 'redux'

@connect(false, dispatch => ({design: bindActionCreators(design, dispatch)}))
class Page404 extends Component {
    componentDidMount() {
        this.props.design.setLine(null)
    }
    render() {
        return <div className='page'>
            {!this.props.hideTitle ? <Title /> : false}
            <div className='text'>
                <h2>Страница не найдена</h2>
                <p><br/><Link to='/'>Вернуться на главную</Link><br/><br/></p>
            </div>
        </div>
    }
}

export default Page404
