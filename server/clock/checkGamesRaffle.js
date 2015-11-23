import '../libs/mongoose'
import Users from '../models/user'
import Games from '../models/games'
import Notifications from '../models/notifications'
import config from 'config'
import moment from 'moment'
import { Types } from 'mongoose'
import 'moment/locale/ru'

let mandrill = require('node-mandrill')(config.mandrill)

let sendMessage = function*(user, text) {
    let fields = {
        message: {
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
            subject: 'Скоро розыгрыш призов!'
        },
        template_name: 'russell',
        template_content: [{
            name: 'content',
            content: `<h3>${text}<br/><br/>
                        Если вы еще не успели в ней поучаствовать, самое время начать!
                        И, возможно, именно вы выиграете приз – технику Russell Hobbs.<br/><br/>

                        Удачи на <a href='http:/www.russellhobbs-promo.ru/'>www.russellhobbs-promo.ru</a>.</h3>`
        }, {
            name: 'additional',
            content: '<table cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td class="center padding"><img src="http://164623.selcdn.com/russell/layout/images/mail-line.jpg" width="100%"/></td></tr></table>'
        }]
    }
    yield new Promise((fulfill, reject) => {
        mandrill('/messages/send-template', fields, (error, response) => {
            if (error) reject(error)
            fulfill(response)
        })
    })
}

export default function* () {
    let games = yield Games.find({
        code: { $in: ['checks', 'kitchen'] }
    })

    let data = yield Notifications.aggregate({$group: {
        _id: '$game',
        dates: { $push: '$raffle'}
    }}).exec()

    data = yield Games.populate(data, {path: '_id', select: 'code'})

    let notifications = {}
    data.map(el => {
        notifications[el._id.code] = el.dates
    })

    let users = yield Users.find()
    for (let i = 0; i < games.length; i++) {
        let game = games[i]
        for (let r = 0; r < game.raffles.length; r++ ) {
            let raffle = game.raffles[r]
            if (moment(raffle).diff(moment(), 'days') < 3 && moment() < moment(raffle)) {
                let skip = notifications[game.code] && notifications[game.code].indexOf(raffle) === -1
                if (!skip) {
                    for (let u = 0; u < users.length; u++) {
                        let text
                        switch (game.code) {
                        case 'kitchen':
                            text = `Совсем скоро, ${moment(raffle).format('D MMMM')}, состоится розыгрыш призов<br/>
                                        по нашим акциям «Cобери коллекцию» и «Выиграй мечту».`
                            break
                        default:
                            text = `Совсем скоро, ${moment(raffle).format('D MMMM')}, состоится розыгрыш призов<br/>
                            по нашей акции «${game.name}».`
                        }
                        yield sendMessage(users[u], text)
                    }
                    yield Notifications.create({
                        raffle: new Date(raffle),
                        game: Types.ObjectId(game._id)
                    })
                }
            }
        }
    }
    console.log('checkGamesRaffle')
}
