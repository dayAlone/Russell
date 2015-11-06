import bodyParser from 'koa-bodyparser'
export default bodyParser({
    formLimit: '3mb',
    jsonLimit: '3mb'
})
