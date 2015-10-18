import { LOGIN_SUCCESS, LOGIN_FAILURE, LOGIN_SOCIAL, LOGIN_SIMPLE } from '../constants/Login';

const initialState = {
    isLogin: false,
    error: false
};

export default (state = initialState, action) => {
    switch (action.type) {
    case LOGIN_SUCCESS:
        return Object.assign({}, state, {
            isLogin: true,
            data: action.data,
            error: false,
            isEditor: action.data.role === 'editor' || action.data.role === 'admin'
        });
    case LOGIN_FAILURE:
        return Object.assign({}, state, {
            isLogin: false,
            error: action.error
        });
    default:
        return state;
    }
}
