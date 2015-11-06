import util from 'util'
import stream from 'stream'

function Collector() {
    stream.Writable.call(this, {objectMode: true})
    this.entities = []
}

util.inherits(Collector, stream.Writable)

Collector.prototype._write = (chunk, encoding, callback) => {
    console.log(Collector.prototype)
    this.entities.push(chunk)
    callback()
}


module.exports = Collector
