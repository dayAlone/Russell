import Router from 'koa-router'
import Games from '../../models/games'
import Scores from '../../models/scores'
import { Types } from 'mongoose'
import moment from 'moment'
import config from 'config'
import pluralize from '../../../client/js/libs/pluralize'

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
            if (all[i]._id.toString() === user.toString()) {
                position = all.length - i
                break
            }
        }
        return position ? position : all.length + 1
    } catch (e) {
        console.error('getUserRating' + e)
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
                {$match: { user: user, $or: query}},
                {$group: {
                    _id: '$type',
                    total: { $sum: '$scores' },
                    count: { $sum: 1 }
                }}
            ])
            .exec()
            for (let i = 0; i < scores.length; i++) {
                let {_id, total} = scores[i]
                scores[i]['position'] = yield getUserRating(user, _id, total, raffles)
            }
            return scores
        } catch (e) {
            console.error('getUserTotalScores' + e)
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
            let totals = yield getUserTotalScores(user._id)
            totals.map(el => {
                result[el._id] = el
            })
            let query = []
            games.map(el => {
                query.push({
                    type: el,
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

            scores.map(el => {
                if (!result[el.type]['today']) result[el.type]['today'] = []
                result[el.type]['today'].push(el)
            })

            if (typeof after === 'function') result = yield after(result)

        } catch (e) {
            console.error('getUserScores' + e)
            return { error: e }
        }
        return { error: false, result: result }
    }
}

export default function(app) {
    const router = new Router()
    router
        .get('/games/:id/', function* () {
            let meta
            if (this.query.id) {
                try {
                    let scores = 0
                    let item = yield Scores.findOne({
                        _id: this.query.id
                    })
                    if (item) {
                        let total = yield getUserTotalScores(item.user)
                        total.map(el => {
                            if (el._id.toString() === item.type.toString()) {
                                scores = el.total
                            }
                        })

                        let scoresText = pluralize(scores, ['балл', 'балла', 'баллов', 'балла'])
                        let titles = {
                            kitchen: {
                                title: `Мною уже собрано ${scores} ${scoresText} в игре «Собери коллекцию!».`,
                                description: 'И я все ближе к выигрышу приза! Хотите со мной посоревноваться? Заходите на russellhobbs-promo.ru!',
                            },
                            test: {
                                title: `На моем счету уже ${scores} ${scoresText} в тесте «История в деталях!». `,
                                description: 'И мои шансы на выигрыш приза стали еще больше! Заходите на russellhobbs-promo.ru и давайте соревноваться!',
                            }
                        }
                        meta = {
                            image: `${config.cdn}/layout/images/share-${this.params.id}2.jpg`,
                            title: titles[this.params.id] ? titles[this.params.id].title : '',
                            description: titles[this.params.id] ? titles[this.params.id].description : ''
                        }
                    }
                } catch (e) {
                    console.error(e)
                }
            }

            this.body = this.render('index', {cancelAdaptive: true, meta: meta})
        })
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
                let {id, fields} = this.request.body
                try {
                    if (parseInt(fields.level, 10) > 0) fields['level'] = fields.level
                    result = yield getUserScores(this.req.user, function*(user) {
                        yield Scores.findOneAndUpdate(
                            { _id: id, user: user._id },
                            { $set: fields },
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
