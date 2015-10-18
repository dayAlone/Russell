require('dotenv').config({silent: true});
if (process.env.NODE_ENV !== 'production') { require('./libs/trace'); }

import koa from 'koa';
import config from 'config';
import './libs/mongoose';

import initMiddlewares from './middlewares';
import initControllers from './controllers';

const app = koa();
app.keys = [config.secret];

initMiddlewares(app);
initControllers(app);

app.listen(process.env.NODE_ENV === 'production' ? ( process.env.PORT ? process.env.PORT : 80 ) : 3000);

/*
import selectel from 'selectel-manager';
selectel.authorize(config.selectel.login, config.selectel.password, (err, data) => {
    if (!err) {
        selectel.createLink(config.__dirname + '/index.js', '/russell/index.js', (err, data) => {
            console.log(data);
        });
    }
});
*/
