'use strict';

// Module dependencies
var mongoose = require('mongoose');

// Models
var User = mongoose.model('User');

/**
 * This method will check for the credentials provided
 * by the user and will throw an error if the credentials or not
 * valid or redirect to the home page if valid.
 * 
 * @param  Object req The request object.
 * @param  Object res The response object.
 */
exports.login = function(req, res) {
    req.checkBody('mail', 'Please provide a valid email address.').isEmail();

    var errors = req.validationErrors() || [];

    if(errors.length > 0) {
        return res.status(400).json(errors);
    }

    User.findOne({email: req.body.mail}, function(err, user) {

    });
};