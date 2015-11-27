import mongoose from 'mongoose'

const maillistSchema = new mongoose.Schema({
    active: {
        type: Boolean,
        default: true
    },
    name: {
        type: String,
        default: ''
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
    }
})

const Maillist = mongoose.model('Maillist', maillistSchema)
//require('./fixtures/maillist')(Maillist)

Maillist.count({}, (err, count) => {
    if (count === 0) require('./fixtures/maillist')(Maillist)
    else console.log(count)
})

export default Maillist
