import { GET_CHECKS, REMOVE_PRODUCT_FROM_CHECK } from '../constants/Profile'

const initialState = {
    checks: [],
    favorites: [],
    scores: [],
    prizes: [],
}

export default function(state = initialState, action) {
    switch (action.type) {
    case GET_CHECKS:
    case REMOVE_PRODUCT_FROM_CHECK:
        return Object.assign({}, state, {
            checks: action.data
        })
    default:
        return state
    }
}
