import Router from 'koa-router'
import { check as Check } from '../../models/check'
import Game from '../../models/games'
import Users from '../../models/user'
import Winners from '../../models/winners'
import stringify from 'csv-stringify'
import { Iconv } from 'iconv'
import { Types } from 'mongoose'
import moment from 'moment'

export default function(app) {
    const router = new Router()
    router
        .get('/admin/users/get-csv/', function* () {
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
                let fields = {}
                let {type, offset, limit, id, raffle} = this.query
                console.log(type)
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
                this.body = { list: result, meta: { limit: limit, total_count: total }}
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
                    let { id } = this.request.body
                    let data = yield Winners.findOne({ _id: id }).populate('user').populate('prize')
                    console.log(data)
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

        /*.get('/admin/*', function* () {
            if (this.req.user && this.req.user.role === 'admin') {
                this.body = this.render('index')
            } else {
                this.redirect('/')
            }
        })*/
    app.use(router.routes())
}
