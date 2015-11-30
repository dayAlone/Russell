import {
    GET_CHECKS,
    GET_FAVORITES,
    REMOVE_PRODUCT_FROM_CHECK,
    ASSIGN_PRODUCT_TO_CHECK,
    START_GAME,
    UPDATE_GAME,
    GET_SCORES,
    GET_PRESENTS,
    GET_PRIZES
} from '../constants/Profile'

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

export function getPrizes() {
    return dispatch => {
        $.get('/profile/prizes/get/', data => {
            if (!data.error) {
                dispatch({
                    type: GET_PRIZES,
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

export function getScores() {
    return dispatch => {
        $.get('/games/get-scores/', data => {
            if (!data.error) {
                dispatch({
                    type: GET_SCORES,
                    data: data.result
                })

            }
        })
    }
}

export function getPresents() {
    return dispatch => {
        $.get('/profile/presents/get/', data => {
            if (!data.error) {
                dispatch({
                    type: GET_PRESENTS,
                    data: data.result
                })

            }
        })
    }
}

export function startGame(type, finished) {
    return dispatch => {
        $.post('/games/start/', {type: type, finished: finished}, data => {
            if (!data.error) {
                dispatch({
                    type: START_GAME,
                    data: data.result
                })

            }
        })
    }
}

export function updateGame(id, fields) {
    return dispatch => {
        $.post('/games/update/', {id: id, fields: fields}, data => {
            if (!data.error) {
                dispatch({
                    type: UPDATE_GAME,
                    data: data.result
                })
            }
        })
    }
}
