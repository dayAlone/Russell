import Router from 'koa-router'
import config from 'config'
import { check as Check } from '../../models/check'
import moment from 'moment'
const getUserChecks = function* (user, pre, after) {
    if (user && user.role === 'user') {
        let result
        try {
            if (typeof pre === 'function') yield pre(user)
            result = yield Check.find({
                user: user._id
            }, {}, {
                sort: {
                    created: -1
                }
            }).populate('products.product')
            if (typeof after === 'function') result = yield after(result)
        } catch (e) {
            return { error: e }
        }
        return { error: false, result: result }
    }
}

const getUserFavorites = function* (raw) {
    let favorites = []
    raw.map(el => {
        if (moment(el.until) > moment()) {
            el.products.map(p => {
                favorites.push(p.product._id)
            })
        }
    })
    return favorites
}

export default function(app) {
    const router = new Router()
    router
        .get('/profile/', function* () {
            if (this.req.user) {
                this.body = this.render('index')
            } else {
                this.redirect('/')
            }
        })
        .get('/profile/checks/get/', function* () {
            let result = yield getUserChecks(this.req.user)
            this.body = result
        })
        .get('/profile/favorites/get/', function* () {
            let result = yield getUserChecks(this.req.user, false, getUserFavorites)
            this.body = result
        })
        .post('/profile/checks/remove-product/', function* () {
            let {product, check} = this.request.body
            let result = yield getUserChecks(this.req.user, function*(user) {
                yield Check.findOneAndUpdate(
                    { _id: check, user: user._id },
                    { $pull: { products: {_id: product} } },
                    { safe: true, upsert: true }
                )
            }, function*(raw) {
                let favorites = yield getUserFavorites(raw)
                let data = {
                    checks: raw,
                    favorites: favorites
                }
                return data
            })
            this.body = result
        })
        .post('/profile/checks/assign-product/', function* () {
            let {product, check} = this.request.body
            let result = yield getUserChecks(this.req.user, function*(user) {
                yield Check.findOneAndUpdate(
                    { _id: check, user: user._id },
                    { $push: { products: {product: product} } },
                    { safe: true, upsert: true }
                )
            }, function*(raw) {
                let favorites = yield getUserFavorites(raw)
                let data = {
                    checks: raw,
                    favorites: favorites
                }
                return data
            })
            this.body = result
        })
        .post('/profile/feedback/send/', function* () {
            let mandrill = require('node-mandrill')(config.mandrill)
            let {subject, phone, message, name, email} = this.request.body
            let result = yield new Promise((fulfill, reject) => {
                mandrill('/messages/send', {
                    message: {
                        to: [{email: 'support@russellhobbs-promo.ru', name: 'Служба поддержки'}],
                        from_email: email,
                        from_name: name,
                        subject: `Обратная связь RussellHobbs-Promo | ${subject}`,
                        text: `Сообщение отправлено с сайта RussellHobbs-Promo\n\nПользователь: ${name} (${email})\nТелефон: ${phone}\n\nТема: ${subject}\nСообщение: \n${message}`
                    }
                }, (error, response) => {
                    if (error) reject(error)
                    fulfill(response)
                })
            })
            this.body = result[0]

        })
    app.use(router.routes())
}
