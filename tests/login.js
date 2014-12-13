'use strict';

// Module dependencies
var chai = require('chai'),
    sinonChai = require('sinon-chai'),
    sinon = require('sinon'),
    express = require('./utils/ExpressMock'),
    mongoose = require('mongoose'),
    expressValidator = require('express-validator');

chai.should();
chai.use(sinonChai);

// Load utilities
var Model = require('mongoose/lib/model');

// Test the controller
describe('LoginController', function() {

    var req, res;

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

            it('Should send a status 400', function() {
                this.controller.login(req, res);

                res.status.should.have.been.calledWithExactly(400);
            });

            it('Should call json method', function() {
                this.controller.login(req, res);

                res.json.should.have.been.calledOnce;
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

                it('Should return status code 403 if password is not correct', function() {
                    sinon.spy(res, 'status');

                    req.body.password = 'test';

                    this.controller.login(req, res);

                    res.status.should.have.been.calledWithExactly(403);
                });

                it('Should return status code 403 if password is not correct', function() {
                    sinon.spy(res, 'end');

                    req.body.password = 'test';

                    this.controller.login(req, res);

                    res.end.should.have.been.calledOnce;
                });
            });

            describe('Database error', function() {
                beforeEach(function() {
                    // Set body
                    req.body = {
                        mail: '1337@gmail.com'
                    };
                });

                it('Should return status code 500', function() {
                    sinon.spy(res, 'status');

                    this.controller.login(req, res);

                    res.status.should.have.been.calledWithExactly(500);
                });

                it('Should call #end() once', function() {
                    sinon.spy(res, 'end');

                    this.controller.login(req, res);

                    res.end.should.have.been.calledOnce;
                });
            });
        });
    });
});