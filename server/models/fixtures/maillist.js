import fs from 'fs'
import { Converter } from 'csvtojson'
import parse from 'csv-parse'
const excludes = [
    '.DS_Store'
]


export default (Maillist) => {
    const files = fs.readdirSync(__dirname + '/csv/')
        .filter(file => { return !excludes.includes(file) })
    for (let i = 0; i < files.length; i++) {
        let converter = new Converter({})
        converter.on('end_parsed', (jsonArray) => {
            console.log(jsonArray.length)
            for (let x = 0; x < jsonArray.length; x++) {
                let row = jsonArray[x]
                console.log(jsonArray[x])
            }
        })

        fs.createReadStream(__dirname + '/csv/' + files[i]).pipe(converter)
    }
}
