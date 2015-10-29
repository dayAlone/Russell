import Router from 'koa-router'
import Games from '../../models/games'

export default function(app) {
    const router = new Router()
    router
        .get('/games/get/', function* () {
            let result
            try {
                result = yield Games.find()
            } catch (e) {
                this.body = { error: e }
            }
            this.set('Cache-Control', 'max-age=36000, must-revalidate')
            this.body = { error: false, result: result }
        })
    app.use(router.routes())
}
