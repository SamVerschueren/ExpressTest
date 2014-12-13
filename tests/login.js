'use strict';

// Module dependencies
var chai = require('chai'),
    sinonChai = require('sinon-chai'),
    sinon = require('sinon'),
    express = require('./utils/ExpressMock'),
    mongoose = require('mongoose'),
    expressValidator = require('express-validator'),
    flash = require('connect-flash');

chai.should();
chai.use(sinonChai);

// Load utilities
var Model = require('mongoose/lib/model');

// Test the controller
describe('LoginController', function() {

    var req, res;
    var noop = function() {};

    before(function() {
        var user = {
            firstName: 'Sam',
            name: 'Verschueren',
            email: 'sam.verschueren@gmail.com',
            password: 'test1234',
            authenticate: function(pwd) {
                return this.password === pwd;
            }
        };

        var modelStub = sinon.stub(Model, 'findOne');
        modelStub.withArgs({email: 'sam.verschueren@gmail.com'}).yields(undefined, user);
        modelStub.withArgs({email: '1337@gmail.com'}).yields({err: 'Error'});

        // Stub mongoose.model('User') to return custom object
        var userStub = sinon.stub(mongoose, 'model').withArgs('User').returns(Model);

        // Load controller after mongoose is stubbed
        this.controller = require('../app/controllers/LoginController');
    });

    beforeEach(function() {
        req = express.request.newInstance();
        res = express.response.newInstance();

        expressValidator()(req, res, noop);
        flash()(req, res, noop);

        // Install stub instead of spy to make sure the real implementation
        // is not called.
        sinon.stub(req, 'flash');
    });

    describe('#login()', function() {
        describe('Wrong email address', function() {
            beforeEach(function() {
                // Set body
                req.body = {
                    mail: 'sam'
                };
            });

            it('Should flash an error object', function() {
                this.controller.login(req, res);

                req.flash.should.have.been.calledWith('error');
            });

            it('Should redirect back to the login page', function() {
                sinon.spy(res, 'redirect');

                this.controller.login(req, res);

                res.redirect.should.have.been.calledWithExactly('/login');
            });
        });

        describe('Valid email address', function() {

            it('Should call findOne one time', function() {
                req.body = {
                    mail: 'sam.verschueren@gmail.com'
                };

                this.controller.login(req, res);

                Model.findOne.should.have.been.calledOnce;
            });

            describe('No database error', function() {
                beforeEach(function() {
                    // Set body
                    req.body = {
                        mail: 'sam.verschueren@gmail.com'
                    };
                });

                it('Should call #redirect() if password is correct', function() {
                    sinon.spy(res, 'redirect');

                    req.body.password = 'test1234';

                    this.controller.login(req, res);

                    res.redirect.should.have.been.calledOnce;
                });

                it('Should redirect to home if password is correct', function() {
                    sinon.spy(res, 'redirect');

                    req.body.password = 'test1234';

                    this.controller.login(req, res);

                    res.redirect.should.have.been.calledWithExactly('/home');
                });

                it('Should flash an error object', function() {
                    this.controller.login(req, res);

                    req.flash.should.have.been.calledWith('error');
                });

                it('Should redirect back to the login page', function() {
                    sinon.spy(res, 'redirect');

                    this.controller.login(req, res);

                    res.redirect.should.have.been.calledWithExactly('/login');
                });
            });

            describe('Database error', function() {
                beforeEach(function() {
                    // Set body
                    req.body = {
                        mail: '1337@gmail.com'
                    };
                });

                it('Should flash an error object', function() {
                    this.controller.login(req, res);

                    req.flash.should.have.been.calledWith('error');
                });

                it('Should redirect back to the login page', function() {
                    sinon.spy(res, 'redirect');

                    this.controller.login(req, res);

                    res.redirect.should.have.been.calledWithExactly('/login');
                });
            });
        });
    });
});