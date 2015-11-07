import Router from 'koa-router'
import Games from '../../models/games'

export default function(app) {
    const router = new Router()
    router
        .get('/games/get/', function* () {
            let result
            try {
                result = yield Games.find({}, {}, {
                    sort: {
                        sort: 1
                    }
                })
            } catch (e) {
                this.body = { error: e }
            }
            this.set('Cache-Control', 'max-age=36000, must-revalidate')
            this.body = { error: false, result: result }
        })
        .post('/games/start/', function* () {
            let user = this.req.user
            if (user) {
                let result
                try {
                    let {type} = this.request.body
                    result = 123
                } catch (e) {
                    this.body = { error: e }
                }
                this.body = { error: false, result: result }
            }
        })
    app.use(router.routes())
}
