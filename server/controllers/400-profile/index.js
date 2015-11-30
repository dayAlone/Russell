import Router from 'koa-router'
import config from 'config'
import { check as Check } from '../../models/check'
import Game from '../../models/games'
import Present from '../../models/presents'
import Winners from '../../models/winners'
import Users, {sendUserEmail} from '../../models/user'
import moment from 'moment'
import { Types } from 'mongoose'
const getUserChecks = function* (user, pre, after) {
    if (user) {
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

const addOrUpdateCheck = function* () {
    let ctx = this
    let {id, photo, organisation, date__day, date__month, date__year, time__hours, time__minutes, total__rubles, total__cents, photo2} = this.request.body

    let until = yield Game.findCurrentRaffle('checks')
    let error = false
    let fields = {
        user: Types.ObjectId(this.req.user._id),
        photo: photo,
        photo2: photo2,
        organisation: organisation,
        total: total__rubles + (total__cents && total__cents !== 'undefined' ? '.' + total__cents : ''),
        date: date__day + '.' + date__month + '.' + date__year,
        time: time__hours + ':' + time__minutes,
        until: until,
    }
    try {
        if (parseInt(id, 10) > 0) {
            for (let f in fields) {
                if (!fields[f] || fields[f] === 'undefined') {
                    delete(fields[f])
                }
            }
            fields['status'] = 'moderation'
            fields['kpk_id'] = ''
            fields['status_comment'] = 'Чек ожидает проверки модератором'
            delete(fields.user)
            yield Check.findOneAndUpdate(
                { _id: id, user: this.req.user._id },
                { $set: fields },
                { safe: true, upsert: true }
            )
        } else {
            yield Check.create(fields)
        }

    } catch (e) {
        error = true
        if (e.code == 11000) {
            ctx.body = {error: { message: 'Этот чек уже зарегистрирован', code: e.code} }
        }
        else ctx.body = {error: { message: e.message, code: e.code} }
    }
    if (!error) ctx.body = {error: false, status: 'success'}

}

export default function(app) {
    const router = new Router()
    router

        .get('/profile/checks/get/', function* () {
            let result = yield getUserChecks(this.req.user)
            this.body = result
        })

        .get('/profile/favorites/get/', function* () {
            let result = yield getUserChecks(this.req.user, false, getUserFavorites)
            this.body = result
        })
        .post('/profile/save-email/', function* () {
            let {save_email} = this.request.body
            let result = { error: false, status: 'success' }
            try {

                let user = yield Users.findOne({
                    verifyEmailToken: save_email
                })
                if (user) {
                    user.email = user.tmpEmail
                    user.tmpEmail = ''
                    user.verifyEmailToken = ''
                    yield user.save()
                }
            } catch (e) {
                console.error(e)
                result = {error: { message: e.message, code: e.code} }
            }
            this.body = result
        })
        .post('/profile/change/', function* () {
            let result
            let items = ['displayName', 'email', 'phone', 'photo']
            let changed = false
            let emailChanged = false
            if (this.req.user) {
                try {
                    let user = yield Users.findOne({
                        _id: this.req.user._id
                    })
                    result = user
                    for (let i in items) {
                        let el = items[i]
                        if (this.request.body[el] && this.request.body[el] !== user[el]) {
                            if (el === 'email') {
                                emailChanged = true
                                user.verifyEmailToken = Math.random().toString(36).slice(2, 10)
                                user.tmpEmail = this.request.body[el]
                                let mailFields = {
                                    message: {
                                        subject: 'Подтверждение нового эл. адреса',
                                        to: [{email: user.tmpEmail, name: user.displayName}],
                                        merge: true,
                                        inline_css: true,
                                        merge_language: 'handlebars',
                                        'global_merge_vars': [
                                            {
                                                'name': 'user_name',
                                                'content': user.displayName
                                            }
                                        ],
                                    },
                                    template_name: 'russell',
                                    template_content: [{
                                        name: 'content',
                                        content: `<h3>Подтвердите ваш новый электронный адрес.</h3><br/>
                                                    <a href='http://${config.domain}/?save_email=${user.verifyEmailToken}' class='button'>Подтвердить</a>`
                                    }, {
                                        name: 'additional',
                                        content: '<table cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td class="center padding"><img src="http://164623.selcdn.com/russell/layout/images/mail-line.jpg" width="100%"/></td></tr></table>'
                                    }]
                                }
                                yield sendUserEmail(mailFields)
                            } else {
                                user[el] = this.request.body[el]
                            }
                            changed = true
                        }
                    }
                    if (changed) {
                        yield user.save()
                    }
                    result = { status: 'success', emailChanged: emailChanged }
                } catch (e) {
                    console.log(e)
                    if (e.code == 11000) {
                        result = {error: { message: 'Есть еще один пользователь с таким же эл. ящиком, выберите другой адрес', code: e.code} }
                    }
                    else result = {error: { message: e.message, code: e.code} }
                }
            }
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
        .post('/profile/checks/add/', addOrUpdateCheck)
        .post('/profile/checks/update/', addOrUpdateCheck)
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
        .get('/profile/presents/get/', function* () {
            if (this.req.user) {
                let result
                try {
                    let data = yield Present.find({
                        user: this.req.user._id
                    }).sort({created: -1})
                    result = { error: false, result: data}
                } catch (e) {
                    result = { error: true, message: e.message }
                }
                this.body = result
            }
        })
        .get('/profile/prizes/get/', function* () {
            if (this.req.user) {
                let result
                try {
                    let data = yield Winners.find({
                        user: this.req.user._id
                    }).populate('prize').populate('game')
                    result = { error: false, result: data}
                } catch (e) {
                    result = { error: true, message: e.message }
                }
                this.body = result
            }
        })
        .post('/profile/presents/like/', function* () {
            if (this.req.user) {
                let result
                let { id } = this.request.body
                try {
                    let present = yield Present.findOne({
                        _id: id
                    })
                    if (present) {
                        let action = {}
                        if (present.likes.indexOf(this.req.user._id) === -1) action = { $push: { likes: this.req.user._id } }
                        else action = { $pull: { likes: this.req.user._id } }

                        yield Present.update({
                            _id: id
                        }, action)
                    }
                    result = { error: false, result: true}
                } catch (e) {
                    result = { error: true, message: e.message }
                }
                this.body = result
            }
        })
        .post('/profile/presents/add/', function* () {
            if (this.req.user) {
                let result
                let { image, product, to, from, email } = this.request.body
                try {
                    yield Present.create({
                        image: image,
                        user: Types.ObjectId(this.req.user._id),
                        product: Types.ObjectId(product),
                        to: to,
                        from: from,
                        email: email,
                        created: moment().add(3, 'hours').toDate(),
                    })
                    result = { error: false, result: 'success'}
                } catch (e) {
                    result = { error: true, message: e.message }
                }
                this.body = result
            }
        })
        .get('/profile/*', function* () {
            if (this.req.user) {
                this.body = this.render('index')
            } else {
                this.redirect('/')
            }
        })
    app.use(router.routes())
}
