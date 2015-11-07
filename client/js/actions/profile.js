import { GET_CHECKS, GET_FAVORITES, REMOVE_PRODUCT_FROM_CHECK, ASSIGN_PRODUCT_TO_CHECK, START_GAME, UPDATE_GAME } from '../constants/Profile'

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

export function assignProduct(check, product) {
    return dispatch => {
        $.post('/profile/checks/assign-product/', {check: check, product: product}, data => {
            if (!data.error) {
                dispatch({
                    type: ASSIGN_PRODUCT_TO_CHECK,
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

export function startGame(type) {
    return dispatch => {
        $.post('/games/start/', {type: type}, data => {
            if (!data.error) {
                dispatch({
                    type: START_GAME,
                    data: data.result
                })

            }
        })
    }
}
