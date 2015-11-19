import co from 'co'
import mongoose from 'mongoose'
import moment from 'moment'

const winnerSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
    prize: { type: mongoose.Schema.Types.ObjectId, ref: 'Prize' },
    raffle: Date,
})

const Winner = mongoose.model('Winner', winnerSchema)

export default Winner
