import Router from 'koa-router'
import config from 'config'
export default function(app) {
    const router = new Router()
    router
        .get('/profile/', function* () {
            if (this.req.user) {
                let meta = {
                    image: '',
                    title: '',
                    description: ''
                }
                this.body = this.render('index', {meta: meta})
            } else {
                this.redirect('/')
            }
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
