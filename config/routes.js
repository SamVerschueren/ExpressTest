/*!
 * Module dependencies.
 */

/**
 * Controllers
 */
var home = require('../app/controllers/HomeController');

/**
 * Route middlewares
 */
var auth = require('./middlewares/authorization');

/**
 * Expose routes
 */
module.exports = function(app, passport) {
    app.get('/', home.index);
};
