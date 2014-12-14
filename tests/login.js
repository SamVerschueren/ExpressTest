'use strict';

// Module dependencies
var sinon = require('sinon'),
    mongoose = require('mongoose'),
    expressValidator = require('express-validator');

describe('LoginController', function() {

    before(function() {
        this.user = {
            findOne: function() {}
        };

        var modelStub = sinon.stub(this.user, 'findOne');

        modelStub.withArgs({email: 'sam.verschueren@gmail.com'}).yields(undefined, {name: 'Sam'});
        modelStub.withArgs({email: '1337@gmail.com'}).yields({err: 'Error'});

        // Stub mongoose.model('User') to return custom object
        sinon.stub(mongoose, 'model').withArgs('User').returns(this.user);

        // Load controller after mongoose is stubbed
        this.controller = require('../app/controllers/LoginController');
    });

    beforeEach(function(done) {
        this.req = {};
        this.res = {
            status: function() { return this; },
            json: function() { return this; },
            render: function() { return this; },
            end: function() { return this; }
        };

        expressValidator()(this.req, this.res, done);
    });

    describe('#login()', function() {
        describe('Wrong email address', function() {
            beforeEach(function() {
                // Install spies
                sinon.spy(this.res, 'status');
                sinon.spy(this.res, 'json');

                // Set body
                this.req.body = {
                    mail: 'sam'
                };
            });

            it('Should send status 400', function() {
                this.controller.login(this.req, this.res);

                sinon.assert.calledWith(this.res.status, 400);
            });

            it('Should call json method', function() {
                this.controller.login(this.req, this.res);

                sinon.assert.calledOnce(this.res.json);
            });
        });

        describe('Valid email address', function() {
            beforeEach(function() {
                // Set body
                this.req.body = {
                    mail: 'sam.verschueren@gmail.com'
                };
            });

            it('Should call findOne one time', function() {
                this.controller.login(this.req, this.res);

                sinon.assert.calledOnce(this.user.findOne);
            });
        });
    });
});
