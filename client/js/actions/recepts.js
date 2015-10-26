import { GET_RECEPTS } from '../constants/Recepts'

export function getRecepts() {
    return dispatch => {
        $.get('/recepts/get/', data => {
            if (!data.error) {
                dispatch({
                    type: GET_RECEPTS,
                    data: data.result
                })
            }
        })
    }
}
