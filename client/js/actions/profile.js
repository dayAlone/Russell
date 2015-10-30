import { GET_CHECKS, GET_FAVORITES, REMOVE_PRODUCT_FROM_CHECK } from '../constants/Profile'

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

export function getFavorites() {
    return dispatch => {
        $.get('/profile/favorites/get/', data => {
            if (!data.error) {
                dispatch({
                    type: GET_FAVORITES,
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
                getFavorites()
                dispatch({
                    type: REMOVE_PRODUCT_FROM_CHECK,
                    data: data.result
                })

            }
        })
    }
}
