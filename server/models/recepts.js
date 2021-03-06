import co from 'co'
import mongoose from 'mongoose'
import transliterate from '../libs/textUtil/transliterate'

const receptSchema = new mongoose.Schema({
    name: {
        type: String,
        default: '',
        required: 'Укажите название рецепта'
    },
    code: {
        type: String,
        index: {
            unique: true,
            sparse: true,
            errorMessage: 'Такое название уже используется.'
        }
    },
    description: String,
    preview: String,
    video: String
})

receptSchema.methods.generateCode = function* () {
    var code = this.name.trim()
    .replace(/<\/?[a-z].*?>/gim, '')  // strip tags, leave /<DIGIT/ like: 'IE<123'
    .replace(/[ \t\n!'#$%&'()*+,\-.\/:<=>?@[\\\]^_`{|}~]/g, '-') // пунктуация, пробелы -> дефис
    .replace(/[^a-zа-яё0-9-]/gi, '') // убрать любые символы, кроме [слов цифр дефиса])
    .replace(/-+/gi, '-') // слить дефисы вместе
    .replace(/^-|-$/g, '') // убрать дефисы с концов

    code = transliterate(code)
    code = code.toLowerCase()

    let existing

    while (true) {
        existing = yield Recept.findOne({code: code}).exec()

        if (!existing) break
        // add one more random digit and retry the search
        existing += Math.random() * 10 ^ 0
    }

    this.code = code
}

receptSchema.pre('save', function(next) {
    co(function*() {
        yield* this.generateCode()
    }.bind(this)).then(next, next)
})

const Recept = mongoose.model('Recept', receptSchema)

Recept.count({}, (err, count) => {
    if (count === 0) require('./fixtures/recepts')(Recept)
})

export default Recept
