import Category from '../../../../models/category';
import Router from 'koa-router';
const router = new Router();

router
.get('/get/', function*() {
    let result;
    try {
        result = yield Category.find().sort( { sort: 1 } );
    } catch(e) {
        this.body = { error: e };
    }
    this.body = { error: false, result: result };
})
.post('/add/', function*() {
    const { code, image, name, short_description, description, line } = this.request.body;
    let data = {
        code: code,
        image: image,
        name: name,
        short_description: short_description,
        description: description,
        line: line
    };
    let result;
    try {
        result = yield Category.create(data);
    } catch(e) {
        this.body = { error: e };
    }
    this.body = { error: false, result: result };
});

export default router.routes();
