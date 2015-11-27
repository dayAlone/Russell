import '../libs/mongoose'
import Maillist from '../models/maillist'
import config from 'config'
import { Types } from 'mongoose'
import 'moment/locale/ru'

let mandrill = require('node-mandrill')(config.mandrill)

let sendMessage = function*(user) {
    let fields = {
        message: {
            to: [{email: user.email, name: user.name}],
            merge: true,
            inline_css: true,
            merge_language: 'handlebars',
            'global_merge_vars': [
                {
                    'name': 'user_name',
                    'content': user.name
                },
                {
                    'name': 'id',
                    'content': user._id
                }
            ]
        },
        template_name: 'russell-mass',
        template_content: []
    }
    yield new Promise((fulfill, reject) => {
        mandrill('/messages/send-template', fields, (error, response) => {
            if (error) reject(error)
            fulfill(response)
        })
    })
}

export default function* () {

    let users = yield Maillist.find({
        active: true
    })
    for (let u = 0; u < users.length; u++) {
        yield sendMessage(users[u])
    }
    console.log('checkGamesRaffle')
}
