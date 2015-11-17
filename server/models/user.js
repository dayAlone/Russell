import mongoose from 'mongoose'
import crypto from 'crypto'
import config from 'config'
import co from 'co'
import transliterate from '../libs/textUtil/transliterate'

const ProviderSchema = new mongoose.Schema({
    name: String,
    nameId: {
        type: String,
        index: true
    },
    profile: {} // updates just fine if I replace it with a new value, w/o going inside
})

const userSchema = new mongoose.Schema({
    active: {
        type: Boolean,
        default: true
    },
    role: {
        type: String,
        default: 'user'
    },
    phone: {
        type: String,
        default: ''
    },
    displayName: {
        type: String,
        default: ''
    },
    profileName: {
        type: String,
        validate: [
            {
                validator: function(value) {
                    // also checks required
                    if (this.deleted) return true
                    return value && value.length >= 2
                },
                msg: 'Минимальная длина имени профиля: 2 символа.'
            },
            {
                validator: function(value) {
                    return this.deleted || /^[a-z0-9-]*$/.test(value)
                },
                msg: 'В имени профиля допустимы только буквы a-z, цифры и дефис.'
            },
            {
                validator: function(value) {
                    // if no value, this validator passes (another one triggers the error)
                    return this.deleted || !value || value.length <= 64
                },
                msg: 'Максимальная длина имени профиля: 64 символа.'
            }
        ],
        index: {
            unique: true,
            sparse: true,
            errorMessage: 'Такое имя профиля уже используется.'
        }
    },
    email: {
        type: String,
        unique: true,
        required: 'E-mail пользователя не должен быть пустым.',
        errorMessage: 'Пользователь с такой эл. почтой уже зарегистрирован.',
        validate: [
            {
                validator: function checkNonEmpty(value) {
                    return this.deleted ? true : (value.length > 0)
                },
                msg: 'E-mail пользователя не должен быть пустым.'
            },
            {
                validator: function checkEmail(value) {
                    return this.deleted ? true : /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(value)
                },
                msg: 'Укажите, пожалуйста, корректный email.'
            }
        ]
    },
    passwordHash: {
        type: String
    },
    salt: {
        type: String
    },
    providers: [ProviderSchema],
    gender: {
        type: String,
        enum: {
            values: ['male', 'female'],
            message: 'Неизвестное значение для пола.'
        }
    },
    birthday: String,
    photo: String, // imgur photo link
    verifiedEmail: {
        type: Boolean,
        default: false
    },
    verifyEmailToken: {
        type: String,
        index: true
    },
    passwordResetToken: {  // refresh with each recovery request
        type: String,
        index: true
    },
    tmpEmail: String,
    created: {
        type: Date,
        default: Date.now
    }
})

userSchema.virtual('password')
    .set(function(password) {
        if (password !== undefined) {
            if (password.length < 4) {
                this.invalidate('password', 'Пароль должен быть минимум 4 символа.')
            }
        }

        this._plainPassword = password

        if (password) {
            this.salt = crypto.randomBytes(config.crypto.hash.length).toString('base64')
            this.passwordHash = crypto.pbkdf2Sync(password, this.salt, config.crypto.hash.iterations, config.crypto.hash.length)
        } else {
            // remove password (unable to login w/ password any more, but can use providers)
            this.salt = undefined
            this.passwordHash = undefined
        }
    })
    .get(function() {
        return this._plainPassword
    })

userSchema.methods.generateProfileName = function* () {

    let profileName = this.displayName.trim()
        .replace(/<\/?[a-z].*?>/gim, '')  // strip tags, leave /<DIGIT/ like: 'IE<123'
        .replace(/[ \t\n!'#$%&'()*+,\-.\/:<=>?@[\\\]^_`{|}~]/g, '-') // пунктуация, пробелы -> дефис
        .replace(/[^a-zа-яё0-9-]/gi, '') // убрать любые символы, кроме [слов цифр дефиса])
        .replace(/-+/gi, '-') // слить дефисы вместе
        .replace(/^-|-$/g, '') // убрать дефисы с концов

    profileName = transliterate(profileName)
    profileName = profileName.toLowerCase()

    let existingUser
    while (true) {
        existingUser = yield User.findOne({profileName: profileName}).exec()

        if (!existingUser) break
        // add one more random digit and retry the search
        profileName += Math.random() * 10 ^ 0
    }

    this.profileName = profileName
}

let sendEmail = function* (fields) {
    let mandrill = require('node-mandrill')(config.mandrill)
    return yield new Promise((fulfill, reject) => {
        mandrill('/messages/send-template', fields, (error, response) => {
            if (error) reject(error)
            fulfill(response)
        })
    })
}

userSchema.post('save', function(next) {
    co(function*() {
        let mailFields = {
            message: {
                to: [{email: this.email, name: this.displayName}],
                merge: true,
                inline_css: true,
                merge_language: 'handlebars',
                'global_merge_vars': [
                    {
                        'name': 'user_name',
                        'content': this.displayName
                    }
                ],
            },
            template_name: 'russell',
            template_content: []
        }
        if (this.wasNew) {
            if (this.verifiedEmail !== true) {
                mailFields.message.subject = 'Подтверждение эл. почты'
                mailFields.template_content = [{
                    name: 'content',
                    content: `<h3>Для завершения регистрации, пожалуйста, подтвердите ваш электронный адрес.</h3><br/>
                        <a href='http://${config.domain}/?confirm=${this.verifyEmailToken}' class='button'>Подтвердить</a>`
                }, {
                    name: 'additional',
                    content: '<table cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td class="center padding"><img src="http://164623.selcdn.com/russell/layout/images/mail-line.jpg" width="100%"/></td></tr></table>'
                }]
            }
            yield sendEmail(mailFields)
        }
    }.bind(this)).then(next, next)
})
userSchema.post('init', function(next) {
    co(function*() {
        this._original = this.toObject()
    }.bind(this)).then(next, next)
})

userSchema.pre('save', function(next) {
    if (this.deleted || this.profileName) return next()
    co(function*() {
        yield* this.generateProfileName()
        this.wasNew = this.isNew
    }.bind(this)).then(next, next)
})

userSchema.methods.checkPassword = function(password) {
    if (!password) return false // empty password means no login by password
    if (!this.passwordHash) return false // this user does not have password (the line below would hang!)

    return crypto.pbkdf2Sync(password, this.salt, config.crypto.hash.iterations, config.crypto.hash.length) == this.passwordHash
}

const User = mongoose.model('User', userSchema)

User.count({}, (err, count) => {
    require('./fixtures/users')(User)
})

export default User
export const sendUserEmail = sendEmail
