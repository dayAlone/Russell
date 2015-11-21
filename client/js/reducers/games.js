import { GET_GAMES, GET_PRIZES } from '../constants/Games'

const initialState = {
    list: [],
    prizes: []
};

export default function(state = initialState, action) {
    switch (action.type) {
    case GET_GAMES:
        return Object.assign({}, state, {
            list: action.data
        })
    case GET_PRIZES:
        return Object.assign({}, state, {
            prizes: action.data
        })
    default:
        return state;
    }
}
