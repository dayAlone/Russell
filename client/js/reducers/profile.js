import {
    GET_CHECKS,
    GET_FAVORITES,
    REMOVE_PRODUCT_FROM_CHECK,
    ASSIGN_PRODUCT_TO_CHECK,
    START_GAME,
    UPDATE_GAME,
    GET_SCORES,
    GET_PRESENTS,
    GET_PRIZES
} from '../constants/Profile'

const initialState = {
    checks: [],
    favorites: false,
    scores: false,
    presents: false,
    prizes: [],
}

export default function(state = initialState, action) {
    switch (action.type) {
    case GET_CHECKS:
        return Object.assign({}, state, {
            checks: action.data
        })
    case ASSIGN_PRODUCT_TO_CHECK:
    case REMOVE_PRODUCT_FROM_CHECK:
        return Object.assign({}, state, {
            checks: action.data.checks,
            favorites: action.data.favorites
        })
    case GET_FAVORITES:
        return Object.assign({}, state, {
            favorites: action.data
        })
    case UPDATE_GAME:
    case GET_SCORES:
    case START_GAME:
        return Object.assign({}, state, {
            scores: action.data
        })
    case GET_PRESENTS:
        return Object.assign({}, state, {
            presents: action.data
        })
    case GET_PRIZES:
        return Object.assign({}, state, {
            prizes: action.data
        })
    default:
        return state
    }
}
