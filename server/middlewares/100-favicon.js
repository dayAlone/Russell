import favicon from 'koa-favicon'
import config from 'config'
export default favicon(config.__dirname + '/client/public/images/favicon.ico')
