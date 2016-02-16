import config from 'config'
export default function*(next) {
    if ('www.' + config.domain !== this.request.host) {
        this.response.redirect('http://www.' + config.domain)
    }
    yield next
}
