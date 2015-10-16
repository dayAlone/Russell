import oid from '../libs/oid';
import co from 'co';
import mongoose from 'mongoose';
import transliterate from '../libs/textUtil/transliterate';

const collectionSchema = new mongoose.Schema({
    name: {
        type:     String,
        default:  '',
        required: 'Укажите название коллекции'
    },
    code: {
        type:     String,
        index: {
            unique: true,
            sparse: true,
            errorMessage: 'Такое название коллекции уже используется.'
        }
    },
    short_description: String,
    description: String,
    image: String,
    line: String
});

collectionSchema.methods.generateCode = function* () {
    var code = this.name.trim()
        .replace(/<\/?[a-z].*?>/gim, '')  // strip tags, leave /<DIGIT/ like: 'IE<123'
        .replace(/[ \t\n!'#$%&'()*+,\-.\/:;<=>?@[\\\]^_`{|}~]/g, '-') // пунктуация, пробелы -> дефис
        .replace(/[^a-zа-яё0-9-]/gi, '') // убрать любые символы, кроме [слов цифр дефиса])
        .replace(/-+/gi, '-') // слить дефисы вместе
        .replace(/^-|-$/g, ''); // убрать дефисы с концов

    code = transliterate(code);
    code = code.toLowerCase();

    var existing;
    while (true) {
        existing = yield Collection.findOne({code: code}).exec();

        if (!existing) break;
        // add one more random digit and retry the search
        existing += Math.random() * 10 ^ 0;
    }

    this.code = code;
};

collectionSchema.pre('save', function(next) {
    co(function*() {
        yield* this.generateCode();
        this._id = oid(this.code);
    }.bind(this)).then(next, next);
});
const Collection = mongoose.model('Collections', collectionSchema);
export default Collection;
