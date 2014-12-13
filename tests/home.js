'use strict';

// Module dependencies
var chai = require('chai'),
    sinonChai = require('sinon-chai'),
    sinon = require('sinon'),
    express = require('./utils/ExpressMock');

chai.should();
chai.use(sinonChai);

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
            
            res.render.should.have.been.calledOnce;
        }));

        it('Should render home', sinon.test(function() {
            // Execute method
            home.index(req, res);

            res.render.should.have.been.calledWith('home');
        }));

        it('Should render home with title home', sinon.test(function() {
            // Execute method
            home.index(req, res);

            res.render.should.have.been.calledWithExactly('home', {title: 'Home'});
        }));
    });
});
