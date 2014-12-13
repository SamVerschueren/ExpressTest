'use strict';

// Module dependencies
var sinon = require('sinon'),
    chai = require('chai'),
    expect = chai.expect;

// Controllers
var home = require('../app/controllers/HomeController');

describe('Home', function() {

    beforeEach(function() {
        this.req = {};
        this.res = {
            render: function() { }
        };
    });

    describe('#index()', function() {
        it('Should call render', function() {
            // Install spy on the render method
            sinon.spy(this.res, 'render');

            // Execute method
            home.index(this.req, this.res);
            
            // expect(this.res.render.calledOnce).to.be.true;
            sinon.assert.calledOnce(this.res.render);
        });

        it('Should render home', function() {
            // Install spy on the render method
            sinon.spy(this.res, 'render');

            // Execute method
            home.index(this.req, this.res);

            // expect(this.res.render.args[0][0]).to.be.equals('home');
            // expect(this.res.render.calledWith('home')).to.be.true;
            sinon.assert.calledWith(this.res.render, 'home');
        });

        it('Should render home with title home', function() {
            // Install spy on the render method
            sinon.spy(this.res, 'render');

            // Execute method
            home.index(this.req, this.res);

            // expect(this.res.render.calledWithExactly('home', {title: 'Home'})).to.be.true;
            sinon.assert.calledWithExactly(this.res.render, 'home', {title: 'Home'});
        });
    });
});
