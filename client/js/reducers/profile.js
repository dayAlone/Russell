import { GET_CHECKS, GET_FAVORITES, REMOVE_PRODUCT_FROM_CHECK, ASSIGN_PRODUCT_TO_CHECK } from '../constants/Profile'

const initialState = {
    checks: [],
    favorites: false,
    scores: [],
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
    default:
        return state
    }
}
