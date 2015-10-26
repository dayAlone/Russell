import { LOGIN_SUCCESS, LOGIN_FAILURE, LOGIN_SHOW_MODAL, LOGIN_HIDE_MODAL } from '../constants/Login'

const initialState = {
    isLogin: false,
    error: false,
    modal: false
}

export default (state = initialState, action) => {
    switch (action.type) {
    case LOGIN_SUCCESS:
        return Object.assign({}, state, {
            isLogin: true,
            data: action.data,
            error: false,
            isEditor: action.data.role === 'editor' || action.data.role === 'admin'
        })
    case LOGIN_FAILURE:
        return Object.assign({}, state, {
            isLogin: false,
            error: action.error
        })
    case LOGIN_HIDE_MODAL:
    case LOGIN_SHOW_MODAL:
        return Object.assign({}, state, {
            modal: action.status,
            error: false
        })
    default:
        return state
    }
}
