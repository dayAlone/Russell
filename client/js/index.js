import '../css/style.styl'
import 'babel-core/polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import Router from 'react-router'
import createBrowserHistory from 'history/lib/createBrowserHistory'

import configureStore from './store'
import configureRoutes from './routes'
import ReducerRegistry from './libs/ReducerRegistry'

const coreReducers = require('./reducers/core')
const reducerRegistry = new ReducerRegistry(coreReducers)

const routes = configureRoutes(reducerRegistry)
const store = configureStore(reducerRegistry)

render(<div>
    <Provider store={store}>
        <Router onUpdate={() => window.scrollTo(0, 0)} routes={routes} history={createBrowserHistory()}/>
    </Provider>
</div>, document.querySelector('#app'))
