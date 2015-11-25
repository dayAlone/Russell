import Router from 'koa-router'
import { check as Check } from '../../models/check'
import Game from '../../models/games'
import Users, { sendUserEmail } from '../../models/user'
import Winners from '../../models/winners'
import Presents from '../../models/presents'
import stringify from 'csv-stringify'
import config from 'config'
import { Iconv } from 'iconv'
import { Types } from 'mongoose'
import moment from 'moment'

import request from 'co-request'

let getChecks = function * (ctx) {
    let fields = {}
    let {type, offset, limit, id, raffle} = ctx.query
    if (type && type !== 'all') {
        let until = yield Game.findCurrentRaffle('checks')
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
    } else if (raffle) {
        raffle = JSON.parse(raffle)
        fields['created'] = { $lte: new Date(raffle[1]), $gt: new Date(raffle[0])}
        fields['status'] = 'active'
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
    return {
        total: total,
        result: result
    }
}

export default function(app) {
    const router = new Router()
    router
        .get('/admin/get-report/', function* () {
            if (this.req.user && this.req.user.role === 'admin') {
                let { fields } = this.query
                let { id, code, raffle } = JSON.parse(fields)
                let data = []
                try {
                    switch (code) {
                    case 'kitchen':
                    case 'test':
                        let itemsRaw = yield request.get(`http://${config.domain}/games/rating/get/`, {
                            qs: {
                                limit: '1000000',
                                offset: '0',
                                game: code,
                                raffle: JSON.stringify(raffle)
                            }
                        })
                        let winnersRaw = yield request.get(`http://${config.domain}/games/winners/get/`, {
                            qs: {
                                game: id,
                                raffle: JSON.stringify(raffle)
                            }
                        })
                        let winners = {}
                        let items = JSON.parse(itemsRaw.body).list

                        JSON.parse(winnersRaw.body).list.map(el => (winners[el.user._id] = el.prize))

                        data = [[
                            'Место в рейтинге',
                            'Участник',
                            'Набранно баллов',
                            'Приз'
                        ]]
                        items.map((el, i) => {
                            data.push([
                                i + 1,
                                el._id.displayName,
                                el.total,
                                winners[el._id._id] ? winners[el._id._id].name : ''
                            ])
                        })

                        break
                    case 'checks':
                        console.log(123)
                        break
                    default:

                    }
                    if (data.length > 0) {
                        this.res.writeHead(200, {
                            'Content-Type': 'text/csv; charset=utf-16le; header=present;',
                            'Content-Disposition': 'attachment;filename=' + code + '-' + moment(raffle[0]).format('DD.MM') + '-' + moment(raffle[1]).format('DD.MM.YYYY') + '.csv'
                        })
                        this.res.write(new Buffer([0xff, 0xfe]))
                        let text = yield new Promise((fulfill, reject) => {
                            stringify(data, {delimiter: '\t'}, (err, text) => {
                                if (err) reject(err)
                                fulfill(text)
                            })
                        })
                        let iconv = new Iconv('utf8', 'utf16le')
                        let buffer = iconv.convert(text)
                        this.res.write(buffer)
                        this.res.end()
                    }

                } catch (e) {
                    console.error(e.message, e.stack)
                }

            }
        })
        .get('/admin/users/get-csv/', function* () {
            if (this.req.user && this.req.user.role === 'admin') {

                this.res.writeHead(200, {
                    'Content-Type': 'text/csv; charset=utf-16le; header=present;',
                    'Content-Disposition': 'attachment;filename=users-' + moment().format('DD.MM.YYYY-HH-mm') + '.csv'
                })
                this.res.write(new Buffer([0xff, 0xfe]))

                try {
                    let users = [[
                        'Имя',
                        'Эл. почта',
                        'Телефон',
                        'Пол',
                        'Дата регистрации',
                        'Соц. сеть',
                        'Профиль'
                    ]]
                    let data = yield Users.find({
                        role: { $ne: 'admin' }
                    })
                    data.map(el => {
                        let {displayName, email, phone, gender, providers, created} = el
                        users.push([
                            displayName,
                            email,
                            phone,
                            gender,
                            moment(created).format('DD.MM.YYYY HH:mm:ss'),
                            providers[0] ? providers[0].name : null,
                            providers[0] ? providers[0].profile.profileUrl : null
                        ])
                    })
                    let text = yield new Promise((fulfill, reject) => {
                        stringify(users, {delimiter: '\t'}, (err, text) => {
                            if (err) reject(err)
                            fulfill(text)
                        })
                    })
                    let iconv = new Iconv('utf8', 'utf16le')
                    let buffer = iconv.convert(text)
                    this.res.write(buffer)

                } catch (e) {
                    console.error(e.stack)
                }
                this.res.end()
            }
        })
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
                let { limit } = this.query
                let data = yield getChecks(this)
                this.body = { list: data.result, meta: { limit: limit, total_count: data.total }}
            }
        })
        .get('/admin/checks/get-csv/', function* () {
            if (this.req.user && this.req.user.role === 'admin') {
                this.res.writeHead(200, {
                    'Content-Type': 'text/csv; charset=utf-16le; header=present;',
                    'Content-Disposition': 'attachment;filename=users.csv'
                })
                this.res.write(new Buffer([0xff, 0xfe]))

                try {
                    let users = [[
                        'Имя',
                        'Эл. почта',
                        'Телефон',
                        'Дата загрузки',
                        'КПК',
                        'Сумма',
                        'Статус'
                    ]]
                    let data = yield Users.find({
                        role: { $ne: 'admin' }
                    })
                    data.map(el => {
                        let {displayName, email, phone, gender, providers} = el
                        users.push([
                            displayName,
                            email,
                            phone,
                            gender,
                            providers[0] ? providers[0].name : null,
                            providers[0] ? providers[0].profile.profileUrl : null
                        ])
                    })
                    let text = yield new Promise((fulfill, reject) => {
                        stringify(users, {delimiter: '\t'}, (err, text) => {
                            if (err) reject(err)
                            fulfill(text)
                        })
                    })
                    let iconv = new Iconv('utf8', 'utf16le')
                    let buffer = iconv.convert(text)
                    this.res.write(buffer)

                } catch (e) {
                    console.error(e.stack)
                }
                this.res.end()
            }
        })
        .post('/admin/winners/send/', function* () {
            if (this.req.user && this.req.user.role === 'admin') {
                let result
                try {
                    let { id, raffle } = this.request.body
                    if (raffle) raffle = JSON.parse(raffle)
                    let data = yield Winners.findOne({ _id: id }).populate('user').populate('prize').populate('game')
                    let { game, user, position, prize} = data
                    let mailFields = {
                        message: {
                            subject: 'Поздравляем!',
                            to: [{email: user.email, name: user.displayName}],
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
                        template_content: []
                    }
                    switch (game.code) {
                    case 'kitchen':
                    case 'test':
                        mailFields.template_content.push({
                            name: 'content',
                            content: `<h3>Ура! Russell Hobbs поздравляет вас с победой!<br />
                            Вы заняли ${position} место в нашем конкурсе «Собери коллекцию»<br />
                            от ${moment(raffle[1]).format('DD.MM.YYYY')} и выиграли приз –<br/>
                            <img src="${prize.photo}" width="160"/> <br/>
                            ${prize.name}
                            </h3>`
                        })
                        mailFields.template_content.push({
                            name: 'additional',
                            content: `<table cellpadding="0" cellspacing="0" border="0" width="100%">
                            <tr>
                                <td class="center padding">
                                    <img src="http://164623.selcdn.com/russell/layout/images/mail-line.jpg" width="100%"/>
                                </td>
                            </tr>
                            <tr>
                                <td class="center">
                                    <h3 style="margin-bottom: 0">Примите наши поздравления!</h3>
                                </td>
                            </tr>
                            <tr>
                                <td class="center padding">
                                    <img src="http://164623.selcdn.com/russell/layout/images/mail-line.jpg" width="100%"/>
                                </td>
                            </tr>
                            <tr>
                                <td class="center">
                                    <p>Чтобы получить ваш выигрыш, свяжитесь, пожалуйста, <br/>с нами по электронной почте:<br/>
                                    <a href='mailto:support@russellhobbs-promo.ru'>support@russellhobbs-promo.ru</a>
                                    <br/><br/>Ваш Russell Hobbs</p>
                                    <h1><a href="http://russellhobbs-promo.ru">russellhobbs-promo.ru</a></h1>
                                </td>
                            </tr>
                        </table>`
                        })
                        break
                    default:
                    }

                    yield sendUserEmail(mailFields)
                    yield Winners.update({_id: id}, {$set: {sended: true} })
                    result = {error: false, result: 'success'}
                } catch (e) {
                    result = {error: e.message, code: e.code}
                }
                this.body = result
            }
        })
        .post('/admin/winners/save-prize/', function* () {
            if (this.req.user && this.req.user.role === 'admin') {
                let result
                try {
                    let { id, prize } = this.request.body
                    yield Winners.findOneAndUpdate(
                        { _id: id },
                        { $set: {
                            prize: Types.ObjectId(prize)
                        }})
                    result = {error: false, result: 'success'}
                } catch (e) {
                    result = {error: e.message, code: e.code}
                }
                this.body = result
            }
        })
        .post('/admin/winners/remove/', function* () {
            if (this.req.user && this.req.user.role === 'admin') {
                let result
                try {
                    let { id } = this.request.body
                    yield Winners.remove({
                        _id: id
                    })
                    result = {error: false, result: 'success'}
                } catch (e) {
                    result = {error: e.message, code: e.code}
                }
                this.body = result
            }
        })
        .post('/admin/winners/add/', function* () {
            if (this.req.user && this.req.user.role === 'admin') {
                let result
                try {
                    let { items, game, raffle } = this.request.body
                    raffle = JSON.parse(raffle)
                    console.log(items)
                    let data = yield Winners.find({
                        game: Types.ObjectId(game),
                        raffle: raffle[1]
                    })

                    let exist = data.map(el => (el.position))
                    let skip = false
                    for (let i = 0; i < items.length; i++) {
                        let {user, place, additional} = items[i]
                        if (exist.indexOf(parseInt(place, 10)) === -1) {
                            yield Winners.create({
                                user: Types.ObjectId(user),
                                game: Types.ObjectId(game),
                                raffle: raffle[1],
                                position: place,
                                additional: additional
                            })
                        } else {
                            skip = true
                        }
                    }
                    result = {error: false, result: skip ? 'skip' : 'success'}
                } catch (e) {
                    console.error(e.stack)
                    result = {error: e.message, code: e.code}
                }
                this.body = result
            }
        })
        .post('/admin/presents/update/', function *() {
            if (this.req.user && this.req.user.role === 'admin') {
                let result
                let { id, status } = this.request.body
                try {
                    let letter = yield Presents.findOneAndUpdate({
                        _id: id
                    }, {
                        $set: { status: status, sended: status === 'active' }
                    })
                    if (status === 'active') {
                        let { from, to, email, product, image } = letter

                        let mandrill = require('node-mandrill')(config.mandrill)
                        let mailFields = {
                            message: {
                                subject: `Russell Hobbs знает, что хочет в подарок ${from}.`,
                                to: [{email: email, name: to}],
                                merge: true,
                                inline_css: true,
                                merge_language: 'handlebars',
                                'global_merge_vars': [
                                    {
                                        'name': 'from',
                                        'content': from
                                    },
                                    {
                                        'name': 'to',
                                        'content': to
                                    },
                                    {
                                        'name': 'product',
                                        'content': product
                                    },
                                    {
                                        'name': 'image',
                                        'content': image
                                    }
                                ],
                            },
                            template_name: 'russell-present',
                            template_content: []
                        }
                        yield new Promise((fulfill, reject) => {
                            mandrill('/messages/send-template', mailFields, (error, response) => {
                                if (error) reject(error)
                                fulfill(response)
                            })
                        })
                    }
                    result = {error: false, result: true}
                } catch (e) {
                    result = {error: e.message, code: e.code}
                }
                this.body = result
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
