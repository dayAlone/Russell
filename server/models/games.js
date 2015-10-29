import mongoose from 'mongoose'
import oid from '../libs/oid'
import co from 'co'
import moment from 'moment'

const gameSchema = new mongoose.Schema({
    code: String,
    name: String,
    start: Date,
    end: Date,
    flag: String,
    description: String,
    image: String,
    raffles: [Date]
})

gameSchema.pre('save', function(next) {
    this._id = oid(this.code)
    next()
})

gameSchema.statics.findCurrentRaffle = function* (code) {
    let game = yield Game.findOne({ code: code })
    let current = game.raffles.filter(el => (moment(el) > moment()))[0]
    return current
}

const Game = mongoose.model('Games', gameSchema)

Game.count({}, (err, count) => {
    if (count === 0) require('./fixtures/games')(Game)
})


export default Game
