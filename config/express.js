/*!
 * Module dependencies.
 */
var express = require('express');
var session = require('express-session');
var compression = require('compression');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var csrf = require('csurf');
var serveStatic = require('serve-static');

var mongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var winston = require('winston');
var helpers = require('view-helpers');
var expressValidator = require('express-validator');
var pkg = require('../package.json');

var env = process.env.NODE_ENV || 'development';

module.exports = function (app, config, passport) {
    app.set('showStackError', true);

    // should be placed before express.static
    app.use(compression({
        filter: function (req, res) {
            return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
        },
        treshold: 512
    }));

    app.use(serveStatic(config.root + '/public'));

    // Logging
    // Use winston on production
    var log;
    var format = 'combined';
    if (env !== 'development') {
        log = {
            stream: {
                write: function (message, encoding) {
                    winston.info(message);
                }
            }
        }
    } else {
        format = 'dev';
        log = {};
    }
    // Don't log during tests
    if (env !== 'test') app.use(morgan(format, log));

    // set views path, template engine and default layout
    app.set('views', config.root + '/app/views');
    app.set('view engine', 'jade');

    // expose package.json to views
    app.use(function (req, res, next) {
        res.locals.pkg = pkg;
        next();
    });

    // cookieParser should be above session
    app.use(cookieParser());

    // bodyParser should be above methodOverride
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    // expressValidator must be immediately after bodyparser
    app.use(expressValidator());
    app.use(methodOverride());

    app.use(session({
        resave: true,
        saveUninitialized: true,
        secret: pkg.name,
        store: new mongoStore({
            url: config.db,
            collection: 'sessions'
        })
    }));

    // use passport session
    app.use(passport.initialize());
    app.use(passport.session());

    // connect flash for flash messages - should be declared after sessions
    app.use(flash());

    // should be declared after session and flash
    app.use(helpers(pkg.name));

    // adds CSRF support
    if (process.env.NODE_ENV !== 'test') {
        app.use(csrf());

        // This could be moved to view-helpers :-)
        app.use(function(req, res, next){
            res.locals.csrf_token = req.csrfToken();
            next();
        });
    };
};
