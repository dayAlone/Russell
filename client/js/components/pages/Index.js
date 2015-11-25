import React, { Component } from 'react'
import Helmet from 'react-helmet'

import Title from '../layout/Title'
import Categories from '../Categories'

class PageIndex extends Component {
    componentDidMount() {
        (window.Image ? (new Image()) : document.createElement('img')).src = location.protocol + '//vk.com/rtrg?r=eI/5AIf05VJO6X4NteuvCFMyU4l8kS204P4e3inO8QGQ2z4SfXIpyAGEpi52OvJ30cQz5dpJ/wk0HhFKeY6H8upQJwKZQQlpUn/TKyallyKqB3ObAMua*7RTWDvxygEAQZ/vIPUFK7tOsEGld/KTnaLAdy4E4CfC2GKksbvF6k0-'
    }
    render() {
        return <div className='page page--index'>
            <Helmet title='Russell Hobbs' />
            <Title type='big' />
            <Categories type='carousel' source='collections'>
                <div className='text'>
                    <h2>В cердце вашего дома</h2>
                    <p>Первая чашка кофе утром, тепло свежевыглаженной рубашки, улыбка удовольствия от аромата свежей выпечки – вот те моменты, которые действительно имеют значение, моменты истинной радости. Это уникальный опыт, который ежедневно создается продукцией Russell Hobbs.</p>
                    <p><strong>Мы - Russell Hobbs, в сердце Вашего дома.</strong></p>

                </div>
            </Categories>
        </div>
    }
}

export default PageIndex
