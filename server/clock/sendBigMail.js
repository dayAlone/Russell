import '../libs/mongoose'
import Maillist from '../models/maillist'
import config from 'config'
import oid from '../libs/oid'
import fs from 'fs'
import { Converter } from 'csvtojson'
import 'moment/locale/ru'
import co from 'co'
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
                    'name': 'redirect_merge_var',
                    'content': 'http://russellhobbs-promo.ru/?unsubscribe=' + user._id
                }
            ]
        },
        template_name: 'remington',
        template_content: []
    }
    yield new Promise((fulfill, reject) => {
        mandrill('/messages/send-template', fields, (error, response) => {
            if (error) reject(error)
            fulfill(response)
        })
    })
}



let sendBigMail = function* () {

    let users = yield Maillist.find({
        active: true
    })
    console.log(users.length)
    for (let u = 0; u < users.length; u++) {
        yield sendMessage(users[u])
    }

}

co(function*() {
    yield sendBigMail()
}).then(() => {
    console.log('All sended')
}).catch(e => (console.error(e.stack)))
