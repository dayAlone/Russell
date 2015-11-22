import co from 'co'
import mongoose from 'mongoose'
import moment from 'moment'

const winnerSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'Games' },
    prize: { type: mongoose.Schema.Types.ObjectId, ref: 'Prize' },
    prizes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Products' }],
    raffle: Date,
    position: Number,
    additional: Object,
    sended: {
        type: Boolean,
        default: false,
    }
})

const Winner = mongoose.model('Winner', winnerSchema)

export default Winner
