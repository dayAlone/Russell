require('dotenv').config({silent: true});
require('babel/register');
module.exports = require(`./webpack/${process.env.NODE_ENV}`);
