import Router from 'koa-router'
import passport from 'koa-passport'
import User, {sendUserEmail} from '../../../../models/user'
const router = new Router()
import recaptcha from 'simple-recaptcha-new'
import config from 'config'
router
    .post('/login', function* (next) {
        let ctx = this
        yield passport.authenticate('local', {badRequestMessage: 'Заполните, пожалуйста, оба поля.'},
        function* (err, user, info) {
            if (err) throw err
            if (user) {
                yield ctx.login(user)
            }
            switch (ctx.request.accepts('json', 'html', 'text')) {
            case 'json':
                if (info) {
                    ctx.body = {error: info.message}
                } else {
                    ctx.body = user
                }
                break

            case 'text':
            case 'html':
                if (info && info.message.length > 0) {
                    ctx.session.messages = ctx.session.messages || []
                    ctx.session.messages.push(info.message)
                }
                ctx.redirect('/')
                break

            default: this.throw(406, 'json, html, or text only')
            }

        }).call(this, next)
    })
    .post('/confirm-email/', function* () {
        let {confirm, isNew} = this.request.body
        try {
            let result = yield User.findOneAndUpdate(
                { verifiedEmail: false, verifyEmailToken: confirm },
                { $set: { verifiedEmail: true, verifyEmailToken: '' }}
            )
            if (result && isNew) {
                let mailFields = {
                    message: {
                        to: [{email: result.email, name: result.displayName}],
                        merge: true,
                        inline_css: true,
                        merge_language: 'handlebars',
                        'global_merge_vars': [
                            {
                                'name': 'user_name',
                                'content': result.displayName
                            }
                        ],
                    },
                    template_name: 'russell',
                    template_content: []
                }
                yield sendUserEmail(mailFields)
            }
            this.body = { error: false, result: result }
        } catch (e) {
            console.error(e, e.stack)
            this.body = { error: e }
        }
    })
    .post('/new-password/', function* () {
        let {password, passwordResetToken} = this.request.body
        let search = { passwordResetToken: passwordResetToken }
        if (this.req.user) search = { _id: this.req.user._id }
        try {
            let user = yield User.findOne(
                search
            )
            if (user) {
                user.password = password
                delete user.passwordResetToken
                user.save()
                this.body = { error: false, result: true }
            } else {
                this.body = { error: { message: 'Пользователь с такими данными не найден' } }
            }
        } catch (e) {
            console.error(e, e.stack)
            this.body = { error: e }
        }
    })
    .post('/new-password-email/', function* () {
        let {email} = this.request.body
        try {
            let captcha = yield new Promise((done) => {
                recaptcha(config.recaptcha, this.request.ip, this.request.body.captcha, (err) => {
                    if (err) {
                        done(false)
                    }
                    done(true)
                })
            })
            if (captcha) {
                let passwordResetToken = Math.random().toString(36).slice(2, 10)
                let result = yield User.findOneAndUpdate(
                    { email: email },
                    { $set: {
                        passwordResetToken: passwordResetToken
                    }}
                )
                if (result) {
                    let mailFields = {
                        message: {
                            subject: 'Смена пароля',
                            to: [{email: result.email, name: result.displayName}],
                            merge: true,
                            inline_css: true,
                            merge_language: 'handlebars',
                            'global_merge_vars': [
                                {
                                    'name': 'user_name',
                                    'content': result.displayName
                                }
                            ],
                        },
                        template_name: 'russell',
                        template_content: [{
                            name: 'content',
                            content: `<h3>Для изменения пароля, перейдите по кнопке ниже.</h3><br/>
                        <a href='http://${config.domain}/?change_password=${passwordResetToken}' class='button'>Изменить пароль</a>`
                        }, {
                            name: 'additional',
                            content: '<table cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td class="center padding"><img src="http://164623.selcdn.com/russell/layout/images/mail-line.jpg" width="100%"/></td></tr></table>'
                        }]
                    }
                    yield sendUserEmail(mailFields)
                    this.body = { error: false, result: result }
                } else {
                    this.body = {error: { message: 'Пользователь с такой эл. почтой не найден' } }
                }
            } else {
                this.body = {error: { message: 'Вы пожожи на робота, попробуйте еще раз пройти проверку', code: 11111 } }
            }

        } catch (e) {
            console.error(e, e.stack)
            this.body = { error: e }
        }
    })
    .post('/signup', function* () {
        let {displayName, email, phone, password, photo} = this.request.body
        try {
            let captcha = yield new Promise((done) => {
                recaptcha(config.recaptcha, this.request.ip, this.request.body.captcha, (err) => {
                    if (err) {
                        done(false)
                    }
                    done(true)
                })
            })
            if (captcha) {
                let result = yield User.create({
                    displayName: displayName,
                    email: email,
                    phone: phone,
                    password: password,
                    photo: photo,
                    verifiedEmail: false,
                    verifyEmailToken: Math.random().toString(36).slice(2, 10)
                })
                this.body = { error: false, result: result }
            } else {
                this.body = {error: { message: 'Вы пожожи на робота, попробуйте еще раз пройти проверку', code: 11111 } }
            }

        } catch (e) {
            if (e.code == 11000) {
                this.body = {error: { message: 'Пользователь с таким эл. адресом уже зарегистрирован', code: e.code} }
            } else {
                console.log('try error')
                console.error(e, e.stack)
                this.body = { error: e }
            }
        }


    })
    .get('/login', function* () {
        this.redirect('/')
    })

export default router.routes()
