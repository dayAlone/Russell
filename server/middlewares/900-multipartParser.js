import busboy from 'co-busboy'
import config from 'config'
import randomstring from 'randomstring'
import fs from 'fs'
import co from 'co'
import selectel from 'selectel-manager'


export default function* (next) {

    if (!this.request.is('multipart/*')) {
        return yield* next
    }

    let parser = busboy(this, {
        autoFields: true
    })

    let part
    let tmp = config.__dirname + '/tmp/'
    if (!fs.existsSync(tmp)) fs.mkdirSync(tmp)

    yield new Promise((fulfill, reject) => {
        selectel.authorize(config.selectel.login, config.selectel.password, (err, data) => {
            if (err) reject(err)
            fulfill(data)
        })
    })

    while (part = yield parser) {
        if (part.mimeType.split('/')[0] === 'image' && part.filename) {
            const splits = part.filename.split('.')
            const ext = splits[splits.length - 1]
            const filename = randomstring.generate() + '.' + (ext === 'blob' ? 'jpg' : ext)
            const path = tmp + filename
            const stream = fs.createWriteStream(path)

            this.request.body[part.fieldname] = config.cdn + '/upload/users/' + filename

            part.pipe(stream)
            stream.on('finish', () => {
                selectel.authorize(config.selectel.login, config.selectel.password, (err) => {
                    if (!err) {
                        selectel.uploadFile(
                            path,
                            '/russell/upload/users/' + filename,
                            () => {
                                if (fs.existsSync(path)) fs.unlink(path)
                            }
                        )
                    }

                })
            })
            /*
            yield new Promise((fulfill, reject) => {
                stream.on('finish', () => (fulfill()))
            })
            yield new Promise((fulfill, reject) => {
                selectel.uploadFile(
                    path,
                    '/russell/upload/users/' + filename,
                    (err) => {
                        if (err) reject(err)
                        if (fs.existsSync(path)) fs.unlink(path)
                        fulfill()
                    }
                )
            })*/

        }
    }

    for (let key in parser.fields) {
        this.request.body[parser.fields[key][0]] = parser.fields[key][1]
    }

    yield* next
}
