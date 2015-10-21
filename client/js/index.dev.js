import 'babel-core/polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import Router from 'react-router'
import createBrowserHistory from 'history/lib/createBrowserHistory'

import configureStore from './store/dev'
import configureRoutes from './routes'

import ReducerRegistry from './libs/ReducerRegistry'
import coreReducers from './reducers/core'
const reducerRegistry = new ReducerRegistry(coreReducers)

import DevTools from './components/ui/DevTools'

if (module.hot) {
    module.hot.accept('./reducers/core', () => {
        const nextCoreReducers = require('./reducers/core')
        reducerRegistry.register(nextCoreReducers)
    })
}

const routes = configureRoutes(reducerRegistry)
const store = configureStore(reducerRegistry)



render(<div>
    <Provider store={store}>
        <div>
            <Router routes={routes} history={createBrowserHistory()}/>
            <DevTools />
        </div>
    </Provider>
</div>, document.querySelector('#app'))
