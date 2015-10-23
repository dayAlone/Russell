import Recept from '../../models/recepts'
import Router from 'koa-router'

export default function(app) {
    const router = new Router()

    router
        .get('/recepts/get/', function*() {
            let result
            try {
                result = yield Recept.find()
            } catch (e) {
                this.body = { error: e }
            }
            this.set('Cache-Control', 'max-age=3600000, must-revalidate')
            this.body = { error: false, result: result }
        })
    app.use(router.routes())
}
