import '../libs/mongoose'
import Scores from '../models/scores'
import config from 'config'
import request from 'co-request'

export default function* () {
    let scores = yield Scores.find({
        'share.vk': true
    })
    for (let i = 0; i < scores.length; i++) {
        let {_id, type } = scores[i]
        let url = `http://vk.com/share.php?act=count&url=http://${config.domain}/games/${type}/${_id}`
        let response = yield request(url)
        if (parseInt(response.body.replace('VK.Share.count(0, ', '').replace(')'), 10) === 0) {
            console.log(`vk ${_id}`)
        }
    }

    scores = yield Scores.find({
        'share.fb': true
    })
    for (let i = 0; i < scores.length; i++) {
        let {_id, type } = scores[i]
        let url = `https://graph.facebook.com/?id=http://${config.domain}/games/${type}/${_id}`
        let response = yield request(url)
        console.log(url, JSON.parse(response.body))
    }
}
