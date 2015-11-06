import mongoose from 'mongoose'
import config from 'config'
import initModels from '../models'

let connection = mongoose
    .set('debug', false)
    .connect(config.mongoose.uri, config.mongoose.options)

initModels(connection)

export default mongoose
