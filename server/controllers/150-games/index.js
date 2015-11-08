import Router from 'koa-router'
import Games from '../../models/games'
import Scores from '../../models/scores'
import { Types } from 'mongoose'
import moment from 'moment'

const getUserRating = function* (user, type, scores, raffles) {
    try {
        let position = false
        if (!raffles) raffles = yield Games.findCurrentRaffle([type])
        let query = {
            $match: {
                type: type,
                $and: [
                    {
                        created: {
                            $gte: raffles[type].start
                        }
                    },
                    {
                        created: {
                            $lte: raffles[type].end
                        }
                    }
                ]
            }
        }
        let group = {
            $group: {
                _id: '$user',
                total: { $sum: '$scores' }
            }
        }
        let all = yield Scores.aggregate([
            query,
            group,
            {$match: {total: {
                $gte: scores
            }}},
            {$sort: { total: 1 }}
        ]).exec()
        for (let i = 0; i < all.length; i++) {
            if (all[i]._id.toString() === user._id.toString()) {
                position = all.length - i
                break
            }
        }
        return position ? position : all.length + 1
    } catch (e) {
        console.error(e)
        return false
    }
}
const getUserTotalScores = function* (user) {
    if (user) {
        try {
            let games = ['kitchen', 'test']
            let raffles = yield Games.findCurrentRaffle(games)
            let query = []
            games.map(el => {
                query.push({
                    type: el,
                    $and: [
                        {
                            created: {
                                $gte: raffles[el].start
                            }
                        },
                        {
                            created: {
                                $lte: raffles[el].end
                            }
                        }
                    ]
                })
            })
            let scores = yield Scores.aggregate([
                {$match: { user: user._id, $or: query}},
                {$group: {
                    _id: '$type',
                    total: { $sum: '$scores' },
                    count: { $sum: { $cond: { if: { $not: '$share' }, then: 1, else: 0 } } }
                }}
            ])
            .exec()
            for (let i = 0; i < scores.length; i++) {
                let {_id, total} = scores[i]
                scores[i]['position'] = yield getUserRating(user, _id, total, raffles)
            }
            return scores
        } catch (e) {
            console.error(e)
            return { error: e }
        }
    }
}
const getUserScores = function* (user, pre, after) {
    if (user) {
        let result = {}
        try {
            if (typeof pre === 'function') yield pre(user)
            let games = ['kitchen', 'test']
            let totals = yield getUserTotalScores(user)
            let query = []
            games.map(el => {
                query.push({
                    type: el,
                    share: false,
                    $and: [
                        {
                            created: {
                                $gte: moment().startOf('day')
                            }
                        },
                        {
                            created: {
                                $lte: moment().endOf('day')
                            }
                        }
                    ]
                })
            })
            let scores = yield Scores.find({ user: user._id, $or: query }).sort({ created: -1 })
            totals.map(el => {
                result[el._id] = el
            })

            scores.map(el => {
                if (!result[el.type]['today']) result[el.type]['today'] = []
                result[el.type]['today'].push(el)
            })

            if (typeof after === 'function') result = yield after(result)

        } catch (e) {
            console.error(e)
            return { error: e }
        }
        return { error: false, result: result }
    }
}

export default function(app) {
    const router = new Router()
    router
        .get('/games/get/', function* () {
            let result
            try {
                result = yield Games.find({}, {}, {
                    sort: {
                        sort: 1
                    }
                })
            } catch (e) {
                this.body = { error: e }
            }
            this.set('Cache-Control', 'max-age=36000, must-revalidate')
            this.body = { error: false, result: result }
        })
        .get('/games/clear/', function* () {
            if (this.req.user) {
                let result
                try {
                    yield Scores.remove({
                        user: this.req.user._id
                    })
                } catch (e) {
                    this.body = { error: e }
                }
                this.body = { error: false, result: result }
            }
        })
        .get('/games/get-scores/', function* () {
            let result = yield getUserScores(this.req.user)
            this.body = result
        })
        .post('/games/start/', function* () {
            if (this.req.user) {
                let result
                let {type, finished} = this.request.body
                try {
                    result = yield getUserScores(this.req.user, function*(user) {
                        yield Scores.create({
                            type: type,
                            user: Types.ObjectId(user._id),
                            finished: finished
                        })
                    })
                } catch (e) {
                    this.body = { error: e }
                }
                this.body = result
            }
        })
        .post('/games/update/', function* () {
            if (this.req.user) {
                let result
                let {id, scores, finished} = this.request.body
                try {
                    result = yield getUserScores(this.req.user, function*(user) {
                        yield Scores.findOneAndUpdate(
                            { _id: id, user: user._id },
                            { $set: { scores: scores, finished: finished} },
                            { safe: true, upsert: true }
                        )
                    })
                } catch (e) {
                    this.body = { error: e }
                }
                this.body = result
            }
        })
    app.use(router.routes())
}
