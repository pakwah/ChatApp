require = require('really-need');
var expect = require('chai').expect;
var request = require('supertest');
var mongoose = require('mongoose');
var mockgoose = require('mockgoose');

//// mock database
//mockgoose(mongoose);
//
//var userSchema = mongoose.Schema({
//    username: {type: String, required: true, unique: true},
//    password: {type: String, required: true}
//});
//
//var messageSchema = mongoose.Schema({
//    sender: String,
//    receiver: String,
//    message: String,
//    pushed: Boolean,
//    timestamp: Number
//});
//
//var User = mongoose.model('User', userSchema);
//var Message = mongoose.model('Message', messageSchema);

describe('server tests', function() {
    var test_server;

    beforeEach(function() {
       test_server = require('../server.js', {bustCache: true});
       test_server.initializeDB(require('../db/test_db'));
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