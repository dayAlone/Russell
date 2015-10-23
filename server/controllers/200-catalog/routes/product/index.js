import Product from '../../../../models/products';
import Router from 'koa-router';
const router = new Router();
import { Types } from 'mongoose';
router
.get('/get/', function*() {
    let result;
    try {
        result = yield Product.find();
    } catch(e) {
        this.body = { error: e };
    }
    this.set('Cache-Control', 'max-age=3600000, must-revalidate');
    this.body = { error: false, result: result };
})
.post('/add/', function*() {
    if (this.req.user) {
        const { name,
                artnumber,
                preview,
                images,
                line,
                short_description,
                description,
                category,
                collection } = this.request.body;
        let data = {
            name: name,
            artnumber: artnumber,
            preview: preview,
            images: images,
            line: line,
            short_description: short_description,
            description: description,
            categories: Types.ObjectId(category),
            collections: Types.ObjectId(collection)
        };
        let result;
        try {
            result = yield Product.create(data);
        } catch(e) {
            this.body = { error: e };
        }
        this.body = { error: false, result: result };
    }
});

export default router.routes();
