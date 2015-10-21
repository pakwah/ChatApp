//var require = require('really-need');
require('./common.js');
var expect = require('chai').expect;
var request = require('supertest');

var test_server = require('../server.js');

describe('server tests', function() {
    it('server should be open to connections', function(done) {
        request(test_server.server)
        .get('/')
        .expect(200, done);
    });

    // route to create users
    describe('createUser', function() {
        it('should get the userlist', function(done) {
            request(test_server.server)
            .get('/userList')
            .end(function(err, res, body) {
                    console.log("test trying to obtain user list");
                    console.log(res.body);
                    done();
                });
        });
    });

    // route to obtain history

    // route to obtain user list
});