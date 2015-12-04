import '../libs/mongoose'
import Scores from '../models/scores'
import config from 'config'
import request from 'co-request'
import moment from 'moment'

export default function* () {
    try {
        let scores = yield Scores.find({
            'share.vk': true,
            created: { $gt: moment('2015-11-22T15:00:00.000+0000').toDate()}
        })
        for (let i = 0; i < scores.length; i++) {
            let {_id, type, scores: s } = scores[i]
            let url = `http://vk.com/share.php?act=count&url=http://${config.domain}/games/${type}/${_id}`
            let response = yield request(url)
            let value = parseInt(response.body.replace('VK.Share.count(0, ', '').replace(')'), 10)
            console.log('vk ' + value)
            if (value === 0 && s > 0) {
                yield Scores.update({_id: _id}, { $inc: { scores: -5 }, $set: {'share.vk': false}})
            }
        }

        scores = yield Scores.find({
            'share.fb': true,
            created: { $gt: moment('2015-11-22T15:00:00.000+0000').toDate()}
        })
        for (let i = 0; i < scores.length; i++) {
            let {_id, type, scores: s } = scores[i]
            let url = `https://graph.facebook.com/?id=http://${config.domain}/games/${type}/${_id}`
            let response = yield request(url)
            response = JSON.parse(response.body)
            console.log('fb ' + response.shares)
            if (!response.error && (!response.shares || response.shares === 0) && s > 0) {
                yield Scores.update({_id: _id}, { $inc: { scores: -5 }, $set: {'share.fb': false}})
            }
        }

        console.log('Social checked')

    } catch (e) {
        console.log(e.stack)
    }
}
