'use strict';

// Module dependencies
var sinon = require('sinon'),
    express = require('./utils/ExpressMock'),
    mongoose = require('mongoose'),
    expressValidator = require('express-validator');

// Load utilities
var Model = require('mongoose/lib/model');

// Test the controller
describe('LoginController', function() {

    var req, res;

    before(function() {
        var modelStub = sinon.stub(Model, 'findOne');
        modelStub.withArgs({email: 'sam.verschueren@gmail.com'}).yields(undefined, {name: 'Sam'});
        modelStub.withArgs({email: '1337@gmail.com'}).yields({err: 'Error'});

        // Stub mongoose.model('User') to return custom object
        sinon.stub(mongoose, 'model').withArgs('User').returns(Model);

        // Load controller after mongoose is stubbed
        this.controller = require('../app/controllers/LoginController');
    });

    beforeEach(function(done) {
        req = express.request.newInstance();
        res = express.response.newInstance();

        expressValidator()(req, res, done);
    });

    describe('#login()', function() {
        describe('Wrong email address', function() {
            beforeEach(function() {
                // Install stubs
                sinon.spy(res, 'status');
                sinon.spy(res, 'json');

                // Set body
                req.body = {
                    mail: 'sam'
                };
            });

            it('Should send status 400', function() {
                this.controller.login(req, res);

                sinon.assert.calledWith(res.status, 400);
            });

            it('Should call json method', function() {
                this.controller.login(req, res);

                sinon.assert.calledOnce(res.json);
            });
        });

        describe('Valid email address', function() {
            beforeEach(function() {
                // Set body
                req.body = {
                    mail: 'sam.verschueren@gmail.com'
                };
            });

            it('Should call findOne one time', function() {
                this.controller.login(req, res);

                sinon.assert.calledOnce(Model.findOne);
            });
        });
    });
});
