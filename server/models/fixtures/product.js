import oid from '../../libs/oid'
import config from 'config'
import request from 'request'
import cheerio from 'cheerio'
import selectel from 'selectel-manager'
import fs from 'fs'
import co from 'co'
import { Types } from 'mongoose'

let throttledRequest = require('throttled-request')(request)

throttledRequest.configure({
    requests: 10,
    milliseconds: 5000
})

const uploadFile = (file) => {
    return () => {
        let path = config.__dirname + '/tmp/' + file.name
        selectel.uploadFile(
            path,
            '/russell' + file.path + file.name,
            (err) => {
                if (err) console.error(err)
                if (fs.existsSync(path)) fs.unlink(path)
            })
    }
}

export default function(Product) {

    let collections = ['legacy', 'colours', 'illumina', 'clarity-collection', 'fiesta', 'buckingham', 'aura', 'jewels', 'desire', 'black-glass', 'precision-control', 'cook-home', 'mode', 'explore', 'kitchen-collection']
    let categories = ['toasters', 'steam-mops', 'coffee-machines', 'irons', 'kettles', 'cooking-and-baking', 'food-preparation']

    if (!fs.existsSync(config.__dirname + '/tmp/')) fs.mkdirSync(config.__dirname + '/tmp/')

    selectel.authorize(config.selectel.login, config.selectel.password, () => {

        let exist = {}
        let data = JSON.parse(fs.readFileSync(config.__dirname + '/client/public/links.json', 'utf8'))

        co(function*() {
            let result = yield new Promise((fulfill, reject) => {
                selectel.getContainerFiles('russell', (err, data) => {
                    if (err) reject(err)
                    fulfill(data)
                }, { format: 'json', path: ['upload/lines/', 'upload/products/'] })
            })
            JSON.parse(result.files).map(el => {
                exist['/' + el.name] = true
            })

            data.forEach(url => {

                let category = false
                let collection = false
                categories.forEach(i => {
                    if (url.indexOf(i.substring(0, i.length - 1).split('-')[0]) !== -1) category = i
                })

                collections.forEach(i => {
                    if (url.indexOf(i.substring(0, i.length - 1).split('-')[0]) !== -1) collection = i
                })
                if (!category) {
                    if (collection === 'fiesta' || url.indexOf('grill') !== -1) category = 'cooking-and-baking'
                    if (collection === 'explore' || url.indexOf('blender') !== -1) category = 'food-preparation'
                    if (url.indexOf('coffee') !== -1) category = 'coffee-machines'
                }
                throttledRequest({
                    url: url
                }, (err, response, html) => {

                    let $ = cheerio.load(html, {decodeEntities: false})
                    let nameRaw = $('.dsPROMain > img').attr('title').split(' ')

                    let files = {}
                    let preview = {
                        name: `${oid($('.dsPROMain > img').attr('src'))}.png`,
                        path: '/upload/products/'
                    }
                    files[$('.dsPROMain > img').attr('src')] = preview

                    let line = $('#dsPROstrip').css('background-image').replace(/\s?url\([\'\"]?/, '').replace(/[\'\"]?\)/, '')
                    let image = {
                        name: `${oid(line)}.jpg`,
                        path: '/upload/lines/'
                    }
                    files[line] = image

                    let description = ''
                    $('.dsPROtxt')
                        .find('p')
                        .filter((i, el) => ($(el).html() !== '&nbsp'))
                        .map((i, el) => (description += `<p>${$(el).html()}</p>\n`))

                    if ($('.dsPROdisclaimer p').length > 0) {
                        description += `<p><small>${$('.dsPROdisclaimer p').html()}</small></p>`
                    }

                    let list = []
                    $('.featureList li').map((i, el) => ( list.push($(el).html()) ))

                    let icons = []
                    $('.featureIcons img').map((i, el) => {
                        let image = {
                            name: `${oid($(el).attr('src'))}.gif`,
                            path: '/upload/products/features/'
                        }
                        files[$(el).attr('src')] = image
                        icons.push({
                            image: config.cdn + image.path + image.name,
                            title: $(el).attr('alt')
                        })
                    })


                    let images = []

                    $('#dsPROHvrInset img').each((i, el) => {
                        let image = {
                            name: `${oid($(el).attr('src'))}.jpg`,
                            path: '/upload/products/'
                        }
                        files[$(el).attr('src')] = image
                        images.push(config.cdn + image.path + image.name)
                    })

                    let video = null

                    if ($('.dsPROVideo').length > 0) {
                        if ($('.dsPROVideo param[name="movie"]').length > 0) {
                            video = `https://www.youtube.com/embed/${$('.dsPROVideo param[name="movie"]').attr('value').match(/v\/(.*?)\?/)[1]}`
                        }
                        if ($('.dsPROVideo iframe').length > 0) {
                            video = $('.dsPROVideo iframe').attr('src')
                        }
                    }

                    let result = {
                        name: nameRaw.slice(4, -2).join(' '),
                        artnumber: nameRaw.slice(-2, -1)[0],
                        preview: config.cdn + preview.path + preview.name,
                        images: images,
                        line: config.cdn + image.path + image.name,
                        description: description,
                        features: {
                            list: list,
                            icons: icons
                        },
                        categories: category ? Types.ObjectId(oid(category)) : null,
                        collections: collection ? Types.ObjectId(oid(collection)) : null,
                        pdf: $('.dsPROdoc a').attr('href'),
                        video: video
                    }

                    for (let i in files) {
                        let file = files[i]

                        if (!exist[file.path + file.name]) {
                            if (i) {
                                let stream = throttledRequest({ url: i }).pipe(fs.createWriteStream(config.__dirname + '/tmp/' + file.name))
                                stream.on('finish', uploadFile(file))
                            }
                        }
                    }

                    Product.create(result)

                })
            })

        }).catch(err=>(console.error(err)))


    })

}
