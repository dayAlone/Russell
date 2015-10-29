import co from 'co'
import mongoose from 'mongoose'
import autoIncrement from 'mongoose-auto-increment'
import Game from './games'

const checkSchema = new mongoose.Schema({
    created: {
        type: Date,
        default: Date.now
    },
    organisation: {
        type: String,
        default: '',
        required: 'Укажите название организации'
    },
    inn: String,
    eklz: String,
    date: String,
    time: String,
    total: String,
    kpk_number: String,
    kpk_value: String,
    photo: String,
    status: {
        type: String,
        default: '',
    },
    status_comment: {
        type: String,
        default: 'autocheck',
    },
    count: {
        type: Number,
        default: 0
    },
    vinner: {
        type: Boolean,
        default: false
    },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    until: Date
})

checkSchema.index({ inn: 1, eklz: 1, date: 1, kpk_number: 1, kpk_value: 1}, { unique: 'Custom error message' })

checkSchema.on('index', (err) => {
    if (err) throw new Error('Этот чек уже был зарегистрирован')
})

checkSchema.pre('save', function(next) {
    co(function* () {
        if (!this.until) {
            this.until = yield Game.findCurrentRaffle('dream')
        }
    }.bind(this)).catch(console.error).then(next, next)
})

checkSchema.pre('validate', function(next) {
    if (this.products.length > this.count) next(new Error(`Максимальное число товаров для привязки к чеку: ${this.count}`))
    next()
})


const Check = mongoose.model('Checks', checkSchema)

Check.count({}, (err, count) => {
    if (count === 0) require('./fixtures/checks')(Check)
})

export const init = (connection) => {

    autoIncrement.initialize(connection)
    checkSchema.plugin(autoIncrement.plugin, 'Check')

    return Check
}

export const check = Check
