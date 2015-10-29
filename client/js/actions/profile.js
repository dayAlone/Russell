import { GET_CHECKS } from '../constants/Profile'

export function getChecks() {
    return dispatch => {
        $.get('/profile/checks/get/', data => {
            if (!data.error) {
                dispatch({
                    type: GET_CHECKS,
                    data: data.result
                })
            }
        })
    }
}
