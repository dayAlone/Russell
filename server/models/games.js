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
    raffles: [Date],
    sort: Number
})

gameSchema.pre('save', function(next) {
    this._id = oid(this.code)
    next()
})

gameSchema.statics.findCurrentRaffle = function* (code) {
    let game = yield Game.findOne({ code: code })
    let current = false
    if (game) {
        current = game.raffles.filter(el => (moment(el) > moment()))[0]    
    }
    return current
}

gameSchema.statics.findRaffles = function* (codes) {
    let games = yield Game.find({ code: {$in: codes} })
    let result = {}
    games.map(game => {
        let start, end
        game.raffles.push(game.start)
        game.raffles.sort((a, b) => (a - b)).map(el => {
            if (moment(el) < moment()) start = el
        })
        end = game.raffles.filter(el => (moment(el) > moment()))[0]
        result[game.code] = {
            start: start,
            end: end
        }
    })
    return result
}

const Game = mongoose.model('Games', gameSchema)

Game.count({}, (err, count) => {
    if (count === 0) require('./fixtures/games')(Game)
})


export default Game
