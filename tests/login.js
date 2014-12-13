'use strict';

// Module dependencies
var sinon = require('sinon'),
    expressValidator = require('express-validator');

// Controllers
var login = require('../app/controllers/LoginController');

describe('LoginController', function() {

    beforeEach(function(done) {
        this.req = {};
        this.res = {
            status: function() { return this; },
            json: function() { return this; },
            render: function() { return this; }
        };

        expressValidator()(this.req, this.res, done)
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
                login.login(this.req, this.res);

                sinon.assert.calledWith(this.res.status, 400);
            });

            it('Should call json method', function() {
                login.login(this.req, this.res);

                sinon.assert.calledOnce(this.res.json);
            });
        });
    });
});
