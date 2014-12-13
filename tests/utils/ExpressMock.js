'use strict';

function Response() {
    this.__proto__ = {
        // HTTP/ServerResponse
        writeContinue: function() {},
        writeHead: function() {},
        setTimeout: function() {},
        setHeader: function() {},
        getHeader: function() {},
        removeHeader: function() {},
        write: function() {},
        addTrailers: function() {},
        end: function() {},

        // Express/Response
        status: function() { return this; },
        links: function() { return this; },
        send: function() {},
        json: function() { return this.send(); },
        jsonp: function() { return this.send(); },
        sendFile: function() {},
        download: function() {},
        contentType: function() { return this; },
        type: function() { return this.contentType(); },
        format: function() { return this; },
        attachment: function() { return this; },
        header: function() { return this; },
        set: function() { return this.header(); },
        get: function() {},
        clearCookie: function() { return this; },
        cookie: function() { return this; },
        location: function() { return this; },
        redirect: function() {},
        vary: function() { return this; },
        render: function() {}
    };
};

function Request() {
    this.__proto__ = {

    };
};

exports.response = {
    newInstance: function() {
        return new Response();
    }
};

exports.request = {
    newInstance: function() {
        return new Request();
    }
};