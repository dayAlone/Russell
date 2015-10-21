import React from 'react';
import { IndexRoute, Route } from 'react-router';
import App from '../containers/App';

import Index from '../components/pages/Index';
import History from '../components/pages/History';
import Games from '../components/pages/Games';
import Catalog from '../components/pages/Catalog';
import Collections from '../components/pages/Collections';
import Page404 from '../components/pages/404';
import Category from '../components/pages/Category';
import Product from '../components/pages/Product';
//import Buy from '../components/pages/Buy';

export default function configureRoutes(reducerRegistry) {
    return <Route path='/' component={App} name='Начальная страница'>

        <Route path='history/' component={History} name='История бренда'/>
        <Route path='games/' component={Games} name='Выиграй мечту'/>
        <Route path='buy/' name='Где купить' getComponent={(location, callback) => {
            require.ensure([], require => {
                reducerRegistry.register({stores: require('../reducers/stores')})
                callback(false, require('../components/pages/Buy'))    
            })

        }}/>

            <Route path='catalog/' name='Продукты'>
                <IndexRoute component={Catalog} />
                <Route path='categories/:code' component={Category} source='categories'/>
                <Route path='product/:code' component={Product} />

                <Route path='collections/' name='Коллекции'>
                    <Route path=':code/' component={Category} source='collections'/>
                    <IndexRoute component={Collections} />
                </Route>
            </Route>
            <IndexRoute component={Index} />
            <Route path='*' component={Page404} />
        </Route>;
}
