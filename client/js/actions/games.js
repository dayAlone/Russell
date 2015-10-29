import { GET_GAMES } from '../constants/Games'

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
