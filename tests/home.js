'use strict';

// Module dependencies
var sinon = require('sinon'),
    express = require('./utils/ExpressMock');

// Load controller
var home = require('../app/controllers/HomeController');

// Test the controller
describe('HomeController', function() {

    var req, res;

    // Test the index method
    describe('#index()', function() {

        beforeEach(function() {
            req = express.request.newInstance(),
            res = express.response.newInstance();

            // Install a spy on the render method
            sinon.spy(res, 'render');
        });

        it('Should call render', sinon.test(function() {
            // Execute method
            home.index(req, res);
            
            sinon.assert.calledOnce(res.render);
        }));

        it('Should render home', sinon.test(function() {
            // Execute method
            home.index(req, res);

            sinon.assert.calledWith(res.render, 'home');
        }));

        it('Should render home with title home', sinon.test(function() {
            // Execute method
            home.index(req, res);

            sinon.assert.calledWithExactly(res.render, 'home', {title: 'Home'});
        }));
    });
});
