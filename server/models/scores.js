import co from 'co'
import mongoose from 'mongoose'
import moment from 'moment'

const scoreSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    game: String,
    type: String,
    level: {
        type: Number,
        default: 0,
    },
    scores: {
        type: Number,
        default: 0,
    },
    finished: {
        type: Boolean,
        default: false,
    },
    share: {
        type: Boolean,
        default: false,
    },
    created: {
        type: Date,
        default: Date.now
    },
})

scoreSchema.pre('save', function(next) {
    co(function*() {
        if (this.isNew) {
            let count = yield Score.count({
                user: this.user,
                share: this.share,
                $and: [
                    {
                        created: {
                            $gte: moment().startOf('day')
                        }
                    },
                    {
                        created: {
                            $lte: moment().endOf('day')
                        }
                    }
                ]})
            console.log(count)
        }
    }.bind(this)).then(next, next)
})

const Score = mongoose.model('Score', scoreSchema)

export default Score
