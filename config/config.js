/*!
 * Module dependencies.
 */
var path = require('path');
var rootPath = path.normalize(__dirname + '/..');

/**
 * All the configuration stuff should be declared here. Make a difference
 * between development configuration and production configuration.
 */
module.exports = {
    development: {
        db: 'mongodb://localhost/noobjs_dev',
        root: rootPath,
        app: {
            name: 'Nodejs Express Mongoose Demo'
        }
    },
    production: {

    }
}