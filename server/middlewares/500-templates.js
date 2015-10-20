// initialize template system early, to let error handler use them
// koa-views is a wrapper around many template systems!
// most of time it's better to use the chosen template system directly
require('dotenv').config({silent: true});
import jade from 'jade';
import config from 'config';
import path from 'path';

export default function* (next) {

    var ctx = this;
    /* default helpers*/
    this.locals = ctx.state;

    this.render = function(templatePath, locals) {
        locals = locals || {};
        let localsFull = Object.create(this.locals);

        for (let key in locals) {
            localsFull[key] = locals[key];
        }

        localsFull['cdn'] = config.cdn;
        localsFull['version'] = config.version;
        localsFull['app'] = process.env.NODE_ENV === 'production' && !process.env.TEST ? `${config.cdn}/layout/js/${config.version}/app.js` : '/layout/js/app.js'
        //localsFull['app'] = `${config.cdn}/layout/js/${config.version}/app.js`
        let templatePathResolved = path.join(config.template.root, templatePath + '.jade');

        return jade.renderFile(templatePathResolved, localsFull);
    };

    yield* next;

}
