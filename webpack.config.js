require('dotenv').config({silent: true});
require('babel/register');
module.exports = process.env.NODE_ENV !== 'production' ? require('./webpack/development') : require('./webpack/production');
