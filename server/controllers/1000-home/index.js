import Router from 'koa-router'
import Recepts from '../../models/recepts'
export default function(app) {
    const router = new Router()
    router
        .get('*', function* () {
            let meta = {
                image: '',
                title: '',
                description: ''
            }
            if (this.query.recept) {
                let data = yield Recepts.find({})
                let recept = data.filter(el => {
                    return el._id.toString() === this.query.recept
                })[0]
                if (recept) {
                    meta = {
                        image: recept.preview,
                        title: recept.name,
                        description: ''//recept.description
                    }
                }
            }
            this.body = this.render('index', {meta: meta})
        })
    app.use(router.routes())
}