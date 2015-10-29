import { GET_CHECKS, REMOVE_PRODUCT_FROM_CHECK } from '../constants/Profile'

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

export function removeProduct(check, product) {
    return dispatch => {
        $.post('/profile/checks/remove-product/', {check: check, product: product}, data => {
            if (!data.error) {
                dispatch({
                    type: REMOVE_PRODUCT_FROM_CHECK,
                    data: data.result
                })
            }
        })
    }
}
