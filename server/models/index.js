import fs from 'fs'
const excludes = [
    'index.js',
    'fixtures',
    '.DS_Store'
]
const files = fs.readdirSync(__dirname)
    .filter(file => { return !excludes.includes(file) })
    .map(file => { return file.replace('.js', '') })
    .sort()


export default function(connection) {
    const models = {}

    files.forEach(file => {
        let result = require(`./${file}`)
        if (typeof result.init === 'function') {
            models[file.charAt(0).toUpperCase()] = result.init(connection)
        } else if (typeof result === 'object') {
            models[file.charAt(0).toUpperCase()] = result
        }
    })
    return models
}
