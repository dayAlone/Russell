import { GET_GAMES, GET_PRIZES } from '../constants/Games'

export function getGames() {
    return dispatch => {
        $.get('/games/get/', data => {
            if (!data.error) {
                dispatch({
                    type: GET_GAMES,
                    data: data.result
                })
            }
        })
    }
}

export function getPrizes() {
    return dispatch => {
        $.get('/games/prizes/get/', data => {
            if (!data.error) {
                dispatch({
                    type: GET_PRIZES,
                    data: data.result
                })
            }
        })
    }
}
