import config from 'config'
export default function*(next) {
    if (config.domain !== this.request.host) {
        this.response.redirect('http://' + config.domain)
    }
    yield next
}
