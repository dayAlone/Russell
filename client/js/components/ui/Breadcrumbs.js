import React, { Component } from 'react';
import { Link } from 'react-router';

class Breadcrumbs extends Component {
    render() {
        console.log(this.props);
        if (this.props.routes) {
            let url = '';
            let current = this.props.current;
            let links = this.props.routes.filter(el => (el.name)).map((el, i) => {
                url += el.path;
                return <Link to={url} className='breadcrumbs__item' key={i}>
                    {el.name}
                </Link>;
            });
            console.log(links);
            if (current) {
                url += current.code + '/';
                links.push(
                    <Link to={url} className='breadcrumbs__item' key={this.props.routes.length}>
                        {current.name}
                    </Link>
                );
            }
            return <div className='breadcrumbs'>
                {links}
            </div>;
        }
        return false;
    }
}

export default Breadcrumbs;
