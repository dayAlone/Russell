import { SET_LINE } from '../constants/Design';

const initialState = {
    line: null
};

export default function(state = initialState, action) {
    switch (action.type) {
    case SET_LINE:
        return Object.assign({}, state, {
            line: action.url
        });
    default:
        return state;
    }
}
