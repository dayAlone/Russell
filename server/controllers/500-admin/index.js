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
import randomstring from 'randomstring'

import request from 'co-request'
let isJsonString = (str) => {
    try {
        JSON.parse(str)
    } catch (e) {
        return false
    }
    return true
}

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
        if (!type) fields['status'] = 'active'
    }
    if (parseInt(id, 10) > 0) {
        fields['_id'] = id
    }
    let total = yield Check.count(fields)
    let result = yield Check.find(fields, {}, {
        sort: {
            created: -1
        }
    }).skip(offset).limit(limit).populate('products.product').populate('user', 'displayName _id email photo')
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
                let items = []
                let itemsRaw
                try {
                    switch (code) {
                    case 'kitchen':
                    case 'test':
                        itemsRaw = yield request.get(`http://${config.domain}/games/rating/get/`, {
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
                        items = isJsonString(itemsRaw.body) ? JSON.parse(itemsRaw.body).list : []
                        if (items.length === 0) console.log(itemsRaw.body)
                        if (isJsonString(winnersRaw.body)) JSON.parse(winnersRaw.body).list.map(el => (winners[el.user._id] = el.prize))

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
                        itemsRaw = yield request.get(`http://${config.domain}/admin/checks/get/`, {
                            qs: {
                                limit: '1000000',
                                offset: '0',
                                raffle: JSON.stringify(raffle),
                                type: 'all'
                            }

                        })
                        items = isJsonString(itemsRaw.body) ? JSON.parse(itemsRaw.body).list : []
                        data = [[
                            'ID чека',
                            'Пользователь',
                            'Эл. почта',
                            'Дата загрузки',
                            'КПК',
                            'SKU',
                            'Сумма',
                            'Статус'
                        ]]
                        items.map(el => {
                            data.push([
                                el._id,
                                el.user ? el.user.displayName : '',
                                el.user ? el.user.email : '',
                                moment(el.created).format('DD.MM.YYYY HH:mm'),
                                el.kpk_number,
                                el.products ? el.products.map(p => (p.product.name)).join(', ') : '',
                                el.total,
                                el.status
                            ])
                        })
                        break
                    case 'present':
                        itemsRaw = yield request.get(`http://${config.domain}/games/presents/get/`, {
                            qs: {
                                limit: '1000000',
                                offset: '0',
                                raffle: JSON.stringify(raffle),
                                sort: 'count',
                                status: 'all',
                                admin: 'qwerty'
                            }

                        })
                        items = isJsonString(itemsRaw.body) ? JSON.parse(itemsRaw.body).list : []
                        data = [[
                            'Дата/время',
                            'Позиция',
                            'Участник',
                            'Фото',
                            'Лайков'
                        ]]
                        items.map((el, i) => {
                            data.push([
                                moment(el.created).format('DD.MM.YYYY HH:mm'),
                                i + 1,
                                el.user.displayName,
                                el.image,
                                el.count
                            ])
                        })
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
        .post('/admin/checks/random/', function* () {
            if (this.req.user && this.req.user.role === 'admin') {
                let { raffle, ids } = this.request.body
                let result
                ids = ids || []
                raffle = JSON.parse(raffle)
                let checks = yield Check.find({
                    status: 'active',
                    _id: { $nin: ids },
                    $and: [
                        {
                            created: {
                                $gte: raffle[0]
                            }
                        },
                        {
                            created: {
                                $lte: raffle[1]
                            }
                        }
                    ]
                }, { _id: 1, user: 1 }).populate('user', 'displayName _id')
                let random = Math.floor(Math.random() * checks.length)
                result = { item: checks[random], finish: checks.length === 1 }
                this.body = result
            }
        })
        .post('/admin/checks/update/', function* () {
            if (this.req.user && this.req.user.role === 'admin') {
                let error = false
                try {
                    let {status, status_comment, id, count, organisation, inn, eklz, date, time, total, kpk_number, kpk_value} = this.request.body
                    let fields = {
                        status: status,
                        status_comment: status_comment,
                        count: count,
                        organisation: organisation,
                        inn: inn ? inn : randomstring.generate(),
                        eklz: eklz ? eklz : randomstring.generate(),
                        date: date,
                        time: time,
                        total: total,
                        kpk_number: kpk_number ? kpk_number : randomstring.generate(),
                        kpk_value: kpk_value ? kpk_value : randomstring.generate()
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
            let { limit, raffle } = this.query
            if (this.req.user && this.req.user.role === 'admin' || raffle) {

                let data = yield getChecks(this)

                this.body = { list: data.result, meta: { limit: limit, total_count: data.total }}
            }
        })
        .get('/admin/users/get/', function* () {

            if (this.req.user && this.req.user.role === 'admin') {
                let fields = {}
                let result
                try {
                    let {offset, limit, query} = this.query
                    if (query) {
                        fields = {
                            $or: [
                                {
                                    displayName: {$regex: query}
                                },
                                {
                                    email: {$regex: query}
                                }
                            ]
                        }
                    }

                    let total = yield Users.count(fields)

                    let list = yield Users.find(fields, {}, {
                        sort: {
                            created: -1
                        }
                    }).skip(offset).limit(limit)

                    result = { error: false, list: list, meta: { limit: limit, total_count: total }}
                } catch (e) {
                    console.log(e.stack)
                    result = { error: true }
                }
                this.body = result
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
                    let { game, user, position, prize, additional} = data
                    let { check } = additional
                    if (check) check = yield Check.findOne({ _id: check}).populate('products.product')

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
                    case 'present':
                    case 'kitchen':
                    case 'test':
                        mailFields.template_content.push({
                            name: 'content',
                            content: `<h3>Ура! Russell Hobbs поздравляет вас с победой!<br />
                            Вы заняли ${position} место в нашем конкурсе «${game.name}»<br />
                            от ${moment(raffle[1]).format('DD.MM.YYYY')} и выиграли приз –<br/>
                            <img src="${prize.photo}" width="160"/> <br/>
                            ${prize.name}
                            </h3>`
                        })

                        break
                    case 'checks':
                        let str = `<h3>Ура! Russell Hobbs поздравляет вас с победой!<br />`
                        if (position === 0) {
                            str += `Вы стали главным победителем в нашей акции «Выиграй&nbsp;мечту» от ${moment(raffle[1]).format('DD.MM.YYYY')} и выиграли суперприз – коллекцию кухонной техники Illumina<br/></h3><br/><img src="http://164623.selcdn.com/russell/layout/images/mail-img.jpg" width="100%"/> <br/>`
                        } else {
                            str += `Вы стали одним из победителей в нашей акции «Выиграй&nbsp;мечту» от ${moment(raffle[1]).format('DD.MM.YYYY')} и выиграли ${check.products && check.products.length > 1 ? 'призы' : 'приз'} – </h3>`
                            str += `<table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>`
                            check.products.map((el, i) => (
                                str += `<td class="center">
                                        <img src="${el.product.preview}" width="160"/><br/>${el.product.name}
                                    </td> ${(i + 1) % 3 === 0 ? '</tr><tr>' : ''}`

                            ))

                            str += `</tr>`
                        }
                        mailFields.template_content.push({
                            name: 'content',
                            content: str
                        })

                        break
                    default:
                    }
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
                    yield sendUserEmail(mailFields)
                    yield Winners.update({_id: id}, {$set: {sended: true} })
                    result = {error: false, result: 'success'}
                } catch (e) {
                    console.log(e.stack)
                    result = {error: e.message, code: e.code}
                }
                this.body = result
            }
        })
        .post('/admin/winners/full/', function* () {
            if (this.req.user && this.req.user.role === 'admin') {
                let result
                try {
                    let { id, value } = this.request.body
                    let current = yield Winners.findOneAndUpdate(
                        { _id: id },
                        { $set: {
                            'additional.full': value === 'true' ? true : false
                        }}).exec()

                    yield Winners.update(
                        { _id: { $ne: id}, game: current.game, 'additional.full': true },
                        { $set: {
                            'additional.full': false
                        }}).exec()
                    result = {error: false, result: 'success'}
                } catch (e) {
                    console.error(e)
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
                    let { item, items, game, raffle } = this.request.body
                    raffle = JSON.parse(raffle)
                    let skip = false
                    console.log(items)
                    if (items) {
                        let data = yield Winners.find({
                            game: Types.ObjectId(game),
                            raffle: raffle[1]
                        })
                        let exist = data.map(el => (el.position))

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
                    } else if (item) {
                        let {photo, name, link} = this.request.body
                        yield Winners.create({
                            game: Types.ObjectId(game),
                            raffle: raffle[1],
                            additional: {
                                photo: photo,
                                name: name,
                                link: link
                            }
                        })
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
