import React, { Component } from 'react'
import Title from '../layout/Title'
import Helmet from 'react-helmet'
import Categories from '../Categories'

class PageCatalog extends Component {
    render() {
        return <div className='page page--catalog'>
            <Helmet title={'Russell Hobbs | Каталог продукции'}/>
            <Title />
            <Categories source='categories' routes={this.props.routes}>
                <div className='text text--small'>
                    <h2>Продукты</h2>
                    <p>Продукция компании Russell Hobbs – это больше, чем просто качество, стиль и новые технологии. Наша продукция дает возможность людям создать чудесные мгновения, остающиеся в памяти на всю жизнь. Первая чашка кофе ранним утром, приятное тепло свежевыглаженной рубашки, вкусный ужин в кругу семьи – именно эти мелочи по-настоящему важны для каждого человека. </p>

                    <p>Во всем, что мы делаем, первостепенное значение имеют желания и нужды потребителей, которые дают нам стимул к непрерывному совершенствованию. От чайников и утюгов до грилей и всевозможных приспособлений для приготовления пищи – вся наша продукция создается для того, чтобы сделать жизнь более легкой и одновременно стильной. При создании продукции для нас важны реальные люди и возможность сделать их жизнь более насыщенной, яркой, наполненной приятными событиями. </p>

                    <p>Russell Hobbs<br/>В сердце вашего дома.</p>


                </div>
            </Categories>
        </div>
    }
}

export default PageCatalog
