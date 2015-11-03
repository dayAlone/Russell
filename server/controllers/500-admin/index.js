import Router from 'koa-router'
import config from 'config'
import { check as Check } from '../../models/check'
import Game from '../../models/games'
import moment from 'moment'
import { Types } from 'mongoose'

export default function(app) {
    const router = new Router()
    router

        .get('/admin/checks/get/', function* () {
            if (this.req.user && this.req.user.role === 'admin') {
                let fields = {}
                let {type, offset, limit, id} = this.query
                if (type && type !== 'all') {
                    let until = yield Game.findCurrentRaffle('dream')
                    switch (type) {
                    case 'gameover':
                        fields['until'] = { $lt: until }
                        fields['vinner'] = false
                        break
                    case 'vinner':
                        fields['vinner'] = true
                        break
                    default:
                        fields['status'] = type
                        fields['until'] = { $gte: until }
                    }
                }
                if (parseInt(id, 10) > 0) {
                    fields['_id'] = id
                }
                let total = yield Check.count(fields)
                let result = yield Check.find(fields, {}, {
                    sort: {
                        created: -1
                    }
                }).skip(offset).limit(limit).populate('products.product').populate('user')
                this.body = { list: result, meta: { limit: limit, total_count: total }}
            }
        })
        .get('/admin/*', function* () {
            if (this.req.user && this.req.user.role === 'admin') {
                this.body = this.render('index')
            } else {
                this.redirect('/')
            }
        })
    app.use(router.routes())
}
