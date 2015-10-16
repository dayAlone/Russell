import React, { Component } from 'react';
import { Link } from 'react-router';

class Breadcrumbs extends Component {
    render() {
        console.log(this.props);
        if (this.props.routes) {
            let url = '';
            let current = this.props.current;
            let links = this.props.routes.filter(el => (el.name))
            links = links.map((el, i) => {
                url += el.path;
                if (i !== links.length-1 || current) {
                    return <Link to={url} className='breadcrumbs__item' key={i}>
                        {el.name}
                    </Link>;
                }
                else
                    return <span className='breadcrumbs__item' key={i}>{el.name}</span>;
            });
            if (current) {
                links.push(
                    <span className='breadcrumbs__item' key={this.props.routes.length}>
                        {current.name}
                    </span>
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
