'use strict';

/**
 * The index method of the controller. This will basically render
 * the homepage of the website.
 * 
 * @param  Object req The request object.
 * @param  Object res The response object.
 */
exports.index = function(req, res) {
    res.render('home', {
        title: 'Home'
    });
};