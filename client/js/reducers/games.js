import { GET_GAMES } from '../constants/Games'

const initialState = {
    list: []
};

export default function(state = initialState, action) {
    switch (action.type) {
    case GET_GAMES:
        return Object.assign({}, state, {
            list: action.data
        })
    default:
        return state;
    }
}
