import React from 'react'
import { IndexRoute, Route, Redirect } from 'react-router'
import App from '../containers/App'
import Admin from '../containers/Admin'

import Index from '../components/pages/Index'
import History from '../components/pages/History'
import Games from '../components/pages/Games'
import Catalog from '../components/pages/Catalog'
import Collections from '../components/pages/Collections'
import Page404 from '../components/pages/404'
import Category from '../components/pages/Category'
import Product from '../components/pages/Product'
import Conditions from '../components/pages/Conditions'

export default function configureRoutes(reducerRegistry) {
    return <div>
            <Route path='/admin/' name='Личный кабинет модератора'
                getComponent={(location, callback) => {
                    require.ensure([], require => {
                        callback(false, require('../containers/Admin'))
                    })
                }}
                getIndexRoute={(location, callback) => {
                    require.ensure([], require => {
                        callback(null, {
                            component: require('../components/admin/Index'),
                        })
                    })
                }}
                />
            <Route path='/' component={App} name='Начальная страница'>

            <Route path='history/' component={History} name='История бренда'/>
            <Route path='conditions/' component={Conditions} name='Условия проведения акции'/>

            <Route path='buy/' name='Где купить' getComponent={(location, callback) => {
                require.ensure([], require => {
                    reducerRegistry.register({stores: require('../reducers/stores')})
                    callback(false, require('../components/pages/Buy'))
                })
            }}/>
            <Route path='games/' name='Выиграй мечту'
            getIndexRoute={(location, callback) => {
                callback(null, {
                    component: Games,
                })
            }}
            getChildRoutes={(location, callback) => {
                require.ensure([], require => {
                    reducerRegistry.register({profile: require('../reducers/profile')})
                    callback(null, [
                        {
                            path: 'kitchen',
                            component: require('../components/games/Kitchen')
                        },
                        {
                            path: 'test',
                            component: require('../components/games/Test')
                        },
                        {
                            path: 'dream',
                            component: require('../components/games/Dream')
                        }
                    ])
                })
            }}/>
            <Route path='profile/' name='Личный кабинет'
                getComponent={(location, callback) => {
                    require.ensure([], require => {
                        reducerRegistry.register({profile: require('../reducers/profile')})
                        callback(false, require('../containers/Profile'))
                    })
                }}
                getIndexRoute={(location, callback) => {
                    require.ensure([], require => {
                        callback(null, {
                            component: require('../components/profile/Index'),
                        })
                    })
                }}
                getChildRoutes={(location, callback) => {
                    require.ensure([], require => {
                        callback(null, [
                            {
                                path: 'checks',
                                component: require('../components/profile/Checks')
                            },
                            {
                                path: 'favorites',
                                component: require('../components/profile/Favorites')
                            },
                            {
                                path: 'statistic',
                                component: require('../components/profile/Statistic')
                            },
                            {
                                path: 'prizes',
                                component: require('../components/profile/Prizes')
                            },
                            {
                                path: 'feedback',
                                component: require('../components/profile/Feedback')
                            }
                        ])
                    })
                }}/>
            <Route path='catalog/' name='Каталог продукции'>
                    <IndexRoute component={Catalog} />
                    <Redirect from='categories/' to='./' />
                    <Route path='categories/:code' component={Category} source='categories'/>
                    <Route path='product/:code' component={Product} />

                    <Route path='collections/' name='Коллекции'>
                        <Route path=':code/' component={Category} source='collections'/>
                        <IndexRoute component={Collections} />
                    </Route>
                </Route>
                <IndexRoute component={Index} />
                <Route path='*' component={Page404} />
            </Route>
        </div>
}
