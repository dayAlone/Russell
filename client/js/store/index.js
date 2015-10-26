import { applyMiddleware, compose, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { reduxReactRouter } from 'redux-router';
import createHistory from 'history/lib/createBrowserHistory';
import configureReducers from '../reducers';


export default function configureStore(reducerRegistry) {
    const rootReducer = configureReducers(reducerRegistry.getReducers());

    let store = compose(
        applyMiddleware(thunkMiddleware),
        reduxReactRouter({ createHistory }),
    )(createStore)(rootReducer);

    reducerRegistry.setChangeListener((reducers) => {
        store.replaceReducer(configureReducers(reducers));
    });

    return store;
}
