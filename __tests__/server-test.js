require = require('really-need');
var expect = require('chai').expect;
var request = require('supertest');

describe('server tests', function() {
    var test_server;

    beforeEach(function() {
       test_server = require('../server.js', {bustCache: true});
    });

    afterEach(function(done) {
        test_server.close(done);
    });

    it('server should be open to connections', function(done) {
        request(test_server.server)
        .get('/')
        .expect(200, done);
    });

    // route to create users
    describe('createUser', function() {
        it('should create a user in the database', function() {
            request(test_server.server)
            .get('/userList')
            .end(function(err, res, body) {
                    console.log(body);
                });
        });
    });

    // route to obtain history

    // route to obtain user list
});