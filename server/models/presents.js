import co from 'co'
import mongoose from 'mongoose'
import moment from 'moment'

const presentSchema = new mongoose.Schema({
    status: {
        type: String,
        default: 'moderation'
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Products' },
    email: String,
    image: String,
    from: String,
    to: String,
    created: Date,
    sended: {
        type: Boolean,
        default: false,
    }
})

const Present = mongoose.model('Present', presentSchema)

export default Present
