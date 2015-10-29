import { GET_CHECKS } from '../constants/Profile'

const initialState = {
    checks: [],
    favorites: [],
    scores: [],
    prizes: [],
}

export default function(state = initialState, action) {
    switch (action.type) {
    case GET_CHECKS:
        return Object.assign({}, state, {
            checks: action.data
        })
    default:
        return state
    }
}
