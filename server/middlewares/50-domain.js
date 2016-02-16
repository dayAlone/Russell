import config from 'config'
export default function*(next) {
    console.log(config.domain, this.request.host)
    if ('www.' + config.domain !== this.request.host) {
        this.response.redirect('http://www.' + config.domain)
    }
    yield next
}
