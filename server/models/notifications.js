import co from 'co'
import mongoose, { Types } from 'mongoose'
import moment from 'moment'

const notificationSchema = new mongoose.Schema({
    raffle: Date,
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' }
})

const Notification = mongoose.model('Notification', notificationSchema)

export default Notification
