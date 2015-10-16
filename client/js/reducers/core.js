import { routerStateReducer } from 'redux-router';
export default {
    login: require('./login'),
    games: require('./games'),
    catalog: require('./catalog'),
    router: routerStateReducer
};
