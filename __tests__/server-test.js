process.env.NODE_ENV = "test";
var request = require('supertest');
var expect = require('chai').expect;
var clearDB = require('mocha-mongoose')('mongodb://localhost/appDBTest');
var test_server = require('../server.js');

after(function(done) {
    clearDB(done);
});

// route to create users
describe('createUser', function() {
    afterEach(function(done) {
        clearDB(done);
    });

    it('should create a user', function(done) {
        request(test_server.server)
            .post('/createUser')
            .set('Content-Type', 'application/json')
            .send('{"username":"u1","password":"p1"}')
            .end(function() {
                test_server.db.User.find({}, function(err, userlist) {
                    expect(userlist.length).to.equal(1);
                    done();
                });
            });
    });
});

// route to obtain history
describe('message history', function() {
    afterEach(function(done) {
        clearDB(done);
    });

    it('should have clean message history', function(done) {
        request(test_server.server)
            .get('/history/u1/u2')
            .end(function(err, res) {
                expect(res.statusCode).to.equal(200);
                expect(res.body.length).to.equal(0);
                done();
            });
    });

    it('should have one message', function(done) {
        // create user u1
        request(test_server.server)
            .post('/createUser')
            .set('Content-Type', 'application/json')
            .send('{"username":"u1","password":"p1"}')
            .end(function() {
                // create user u2
                request(test_server.server)
                    .post('/createUser')
                    .set('Content-Type', 'application/json')
                    .send('{"username":"u2","password":"p2"}')
                    .end(function() {
                        var io = require('socket.io-client');
                        var options ={
                            transports: ['websocket'],
                            'force new connection': true
                        };
                        var client1 = io.connect('http://localhost:3000/', options);
                        var client2 = io.connect('http://localhost:3000/', options);

                        client1.emit('login', {username: 'u1', password: 'p1'});
                        client2.emit('login', {username: 'u2', password: 'p2'});

                        client2.on('login', function() {
                            client1.emit('send', {receiver: 'u2', message: 'testing'});
                        });

                        client1.on('sent', function() {
                            request(test_server.server)
                                .get('/history/u1/u2')
                                .end(function(err, res) {
                                    expect(res.body.length).to.equal(1);
                                    client1.disconnect();
                                    client2.disconnect();
                                    done();
                                });
                        });

                    });
            });
    });
});

// route to obtain user list
describe('userList', function() {
    afterEach(function(done) {
        clearDB(done);
    });

    it('should get the userlist', function(done) {
        request(test_server.server)
            .get('/userList')
            .end(function(err, res) {
                expect(res.statusCode).to.equal(200);
                expect(res.body.length).to.equal(0);
                done();
            });
    });

    it('should get a list of one user', function(done) {
        request(test_server.server)
            .post('/createUser')
            .set('Content-Type', 'application/json')
            .send('{"username":"u1","password":"p1"}')
            .end(function() {
                request(test_server.server)
                    .get('/userList')
                    .end(function(err2, res2) {
                        expect(res2.statusCode).to.equal(200);
                        expect(res2.body.length).to.equal(1);
                        done();
                    });
            });
    });
});

describe('socket login', function() {
    afterEach(function(done) {
        clearDB(done);
    });

    it('should fail logging in upon incorrect credentials being provided', function(done) {
        request(test_server.server)
            .post('/createUser')
            .set('Content-Type', 'application/json')
            .send('{"username":"u2","password":"p2"}')
            .end(function() {
                var socket2 = require('socket.io-client');
                var client2 = socket2('http://localhost:3000/');

                client2.on('login', function(res) {
                    expect(res.status).to.equal(false);
                    client2.disconnect();
                    done();
                });

                client2.emit('login', {username: 'u2', password: 'p1'});
            });
    });

    it('should correctly log in with correct credentials', function(done) {
        request(test_server.server)
            .post('/createUser')
            .set('Content-Type', 'application/json')
            .send('{"username":"u1","password":"p1"}')
            .end(function() {
                var io = require('socket.io-client');
                var options ={
                    transports: ['websocket'],
                    'force new connection': true
                };
                var client1 = io.connect('http://localhost:3000/', options);
                client1.on('login', function(res) {
                    expect(res.status).to.equal(true);
                    client1.disconnect();
                    done();
                });

                client1.emit('login', {username: 'u1', password: 'p1'});
            });
    });
});

describe('socket send', function() {
    afterEach(function(done) {
        clearDB(done);
    });

    it('should send a message', function(done) {
        // create user u1
        request(test_server.server)
            .post('/createUser')
            .set('Content-Type', 'application/json')
            .send('{"username":"u1","password":"p1"}')
            .end(function() {
                // create user u2
                request(test_server.server)
                    .post('/createUser')
                    .set('Content-Type', 'application/json')
                    .send('{"username":"u2","password":"p2"}')
                    .end(function() {
                        var io = require('socket.io-client');
                        var options ={
                          transports: ['websocket'],
                          'force new connection': true
                        };
                        var client1 = io.connect('http://localhost:3000/', options);
                        var client2 = io.connect('http://localhost:3000/', options);

                        client1.emit('login', {username: 'u1', password: 'p1'});
                        client2.emit('login', {username: 'u2', password: 'p2'});

                        client2.on('login', function() {
                            client1.emit('send', {receiver: 'u2', message: 'testing'});
                        });

                        client1.on('sent', function() {
                            // successfully sent a message
                            done();
                        });
                    });
            });
    });

});