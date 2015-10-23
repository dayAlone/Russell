import fs from 'fs'
const excludes = [
    'index.js'
]

export default (app) => {
    const files = fs.readdirSync(__dirname)
        .filter(file => { return !excludes.includes(file) })
        .map(file => { return file.replace('.js', '') })
        .sort((a, b)=>{
            return parseInt(a.match(/(\d{3,4})-/), 10) - parseInt(b.match(/(\d{3,4})-/), 10)
        })
    files.forEach(file => {
        require(`./${file}`)(app)
    })

}
