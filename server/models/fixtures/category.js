import oid from '../../libs/oid'
import config from 'config'
import request from 'request'
import cheerio from 'cheerio'
import selectel from 'selectel-manager'
import fs from 'fs'
import co from 'co'

const uploadFile = (file) => {
    return () => {
        let path = config.__dirname + '/tmp/' + file.name
        selectel.uploadFile(
            path,
            '/russell' + file.path + file.name,
            (err) => {
                if (err) console.error(err)
                fs.unlink(path)
            })
    }
}

export default function(Category, parseUrl) {

    if (!fs.existsSync(config.__dirname + '/tmp/')) fs.mkdirSync(config.__dirname + '/tmp/')

    selectel.authorize(config.selectel.login, config.selectel.password, () => {

        co(function*() {
            let exist = {}

            let result = yield new Promise((fulfill, reject) => {
                selectel.getContainerFiles('russell', (err, data) => {
                    if (err) reject(err)
                    fulfill(data)
                }, { format: 'json', path: ['upload/lines/', 'upload/products/'] })
            })
            JSON.parse(result.files).map(el => {
                exist['/' + el.name] = true
            })

            request({
                url: parseUrl
            }, (err, response, html) => {
                let $ = cheerio.load(html, {decodeEntities: false})

                $('#dsnestCat li').each((i, el) => {
                    let $el = $(el)
                    let $img = $el.find('img')
                    let files = {}
                    if ($img.length > 0) {

                        let image = {
                            name: `${oid($img.attr('src'))}.jpg`,
                            path: '/upload/categories/'
                        }
                        files[$img.attr('src')] = image
                        let result = {
                            name: $img.attr('alt'),
                            image: config.cdn + image.path + image.name,
                            short_description: $el.find('p').html(),
                            sort: i * 100
                        }

                        let url = $el.find('a').attr('href')
                        request({
                            url: url
                        }, (err, response, html) => {
                            let $ = cheerio.load(html, {decodeEntities: false})
                            let line = html.match(/#dsContentMaskB"\).css\({'background-image':'url\((.*?)\)'}\)/)[1]
                            let image = {
                                name: `${oid(line)}.jpg`,
                                path: '/upload/lines/'
                            }
                            files[line] = image
                            result.line = config.cdn + image.path + image.name

                            let description = ''
                            $('.dsCATtxt')
                                .find('p, h5')
                                .filter((i, el) => ($(el).html() !== '&nbsp'))
                                .map((i, el) => (description += `<p>${$(el).html()}</p>`))

                            result.code = url.split('/').slice(-2, -1)[0]
                            result.description = description


                            for (let i in files) {
                                let file = files[i]

                                if (!exist[file.path + file.name]) {
                                    let stream = request({ url: i }).pipe(fs.createWriteStream(config.__dirname + '/tmp/' + file.name))
                                    stream.on('finish', uploadFile(file))
                                }
                            }

                            Category.create(result)

                        })
                    }
                })
            })
        })

    })

}
