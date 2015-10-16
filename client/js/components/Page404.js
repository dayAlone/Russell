import React, { Component } from 'react';
import Title from './Title';
import { Link } from 'react-router';
class Page404 extends Component {

    render() {
        return <div className='page page--index'>
            {!this.props.hideTitle ? <Title /> : false}
            <div className='text'>
                <h2>Страница не найдена</h2>
                <p><br/><Link to='/'>Вернуться на главную</Link><br/><br/></p>
            </div>
        </div>;
    }
}

export default Page404;
