import auth from 'koa-basic-auth'
import config from 'config'

const access = config.get('basicAuth')

const tryAuth = function* (next) {
    try {
        yield next
    } catch (err) {
        if (401 === err.status) {
            this.status = 401
            this.set('WWW-Authenticate', 'Basic')
            this.body = 'Nope... you need to authenticate first. With a proper user!'
        } else { throw err }
    }
}

export default process.env.HIDE === 'Y' ? [tryAuth, auth({name: access.name, pass: access.pass})] : null
