import co from 'co'
import mongoose from 'mongoose'
import moment from 'moment'

const prizeSchema = new mongoose.Schema({
    name: String,
    photo: String
})

const Prize = mongoose.model('Prize', prizeSchema)

Prize.count({}, (err, count) => {
    if (count === 0) require('./fixtures/prizes')(Prize)
})

export default Prize
