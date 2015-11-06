import Router from 'koa-router'
import { check as Check } from '../../models/check'
import Game from '../../models/games'

export default function(app) {
    const router = new Router()
    router
        .post('/admin/checks/update/', function* () {
            if (this.req.user && this.req.user.role === 'admin') {
                let error = false
                try {
                    let {status, status_comment, id, count} = this.request.body
                    let fields = {
                        status: status,
                        status_comment: status_comment,
                        count: count,
                    }
                    if (fields['status'] === 'added') {
                        fields['kpk_id'] = ''
                    }
                    yield Check.findOneAndUpdate(
                        { _id: id },
                        { $set: fields},
                        { safe: true, upsert: true }
                    )
                } catch (e) {
                    error = true
                    if (e.code == 11000) {
                        this.body = {error: { message: 'Этот чек уже зарегистрирован', code: e.code} }
                    }
                    else this.body = {error: { message: e.message, code: e.code} }
                }
                if (!error) this.body = {error: false, status: 'success'}
            }

        })
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
        /*.get('/admin/*', function* () {
            if (this.req.user && this.req.user.role === 'admin') {
                this.body = this.render('index')
            } else {
                this.redirect('/')
            }
        })*/
    app.use(router.routes())
}
