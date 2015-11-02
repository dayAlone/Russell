import busboy from 'co-busboy'
import config from 'config'
import randomstring from 'randomstring'
import fs from 'fs'
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

    while (part = yield parser) {
        if (part.mimeType.split('/')[0] === 'image' && part.filename) {
            const splits = part.filename.split('.')
            const filename = randomstring.generate() + '.' + splits[splits.length - 1]
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
                                console.log('uploaded %s', config.cdn + '/upload/users/' + filename)
                            }
                        )
                    }

                })
            })

        }
    }

    for (let key in parser.fields) {
        this.request.body[parser.fields[key][0]] = parser.fields[key][1]
    }

    yield* next
}
