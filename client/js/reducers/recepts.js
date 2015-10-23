import { GET_RECEPTS } from '../constants/Recepts'

const initialState = {
    list: []
}

export default function(state = initialState, action) {
    switch (action.type) {
    case GET_RECEPTS:
        return Object.assign({}, state, {
            list: action.data
        })
    default:
        return state
    }
}
