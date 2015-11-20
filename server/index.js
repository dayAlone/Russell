require('dotenv').config({silent: true})
if (process.env.NODE_ENV !== 'production') { require('./libs/trace') }

import koa from 'koa'
import config from 'config'
import qs from 'koa-qs'
import './libs/mongoose'

import initMiddlewares from './middlewares'
import initControllers from './controllers'

const app = koa()
app.keys = [config.secret]

qs(app)

initMiddlewares(app)
initControllers(app)

app.listen(process.env.NODE_ENV === 'dev' ? 3000 : ( process.env.PORT ? process.env.PORT : 80 ))
