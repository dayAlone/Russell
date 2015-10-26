import { SET_LINE } from '../constants/Design';

export function setLine(url) {
    return dispatch => {
        dispatch({
            type: SET_LINE,
            url: url
        })
    };
}
