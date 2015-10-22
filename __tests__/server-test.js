var require = require('really-need');
process.env.NODE_ENV = "test";
var request = require('supertest');
var expect = require('chai').expect;

// route to create users
describe('createUser', function() {
    var test_server;

    beforeEach(function() {
        test_server = require('../server.js', {bustCache: true});
    });

    afterEach(function(done) {
        test_server.server.close();
        test_server.db.User.remove({}, function() {
            test_server.db.Message.remove({}, done);
        });
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
    var test_server;

    beforeEach(function() {
        test_server = require('../server.js', {bustCache: true});
    });

    afterEach(function(done) {
        test_server.server.close();
        test_server.db.User.remove({}, function() {
            test_server.db.Message.remove({}, done);
        });
    });



    it('should have clean message history', function(done) {
        request(test_server.server)
            .get('/history/u1/u2')
            .end(function(err, res, body) {
                expect(res.statusCode).to.equal(200);
                expect(res.body.length).to.equal(0);
                done();
            });
    });

    it('should have one message', function() {
        // create user u1
        request(test_server.server)
            .post('/createUser')
            .set('Content-Type', 'application/json')
            .send('{"username":"u1","password":"p1"}')
            .end(function() {
                request(test_server.server)
                    .get('/userList')
                    .end(function() {
                        // create user u2
                        request(test_server.server)
                            .post('/createUser')
                            .set('Content-Type', 'application/json')
                            .send('{"username":"u2","password":"p2"}')
                            .end(function() {
                                var socket1 = require('socket.io-client');
                                var client1 = socket1('http://localhost:3000/');
                                var socket2 = require('socket.io-client');
                                var client2 = socket2('http://localhost:3000/');

                                client1.emit('login', {username: 'u1', password: 'p1'});

                                client2.emit('login', {username: 'u2', password: 'p2'});
                                client2.on('login', function() {
                                    client1.emit('send', {receiver: 'u2', message: 'testing'});
                                });

                                client1.on('sent', function() {
                                    request(test_server.server)
                                        .get('/history/u1/u2')
                                        .end(function(err, res, body) {
                                            expect(res.body.length).to.equal(1);
                                        });
                                });

                            });
                    });
            });
    });
});

// route to obtain user list
describe('userList', function() {
    var test_server;

    beforeEach(function(done) {
        test_server = require('../server.js', {bustCache: true});
        test_server.db.User.remove({}, function() {
            test_server.db.Message.remove({}, done);
        });
    });

    afterEach(function(done) {
        test_server.server.close();
        test_server.db.User.remove({}, function() {
            test_server.db.Message.remove({}, done);
        });
    });

    it('should get the userlist', function(done) {
        request(test_server.server)
            .get('/userList')
            .end(function(err, res, body) {
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
                        expect(res2.body.length).to.equal(1);
                        done();
                    });
            });
    });
});

describe('socket login', function() {
    var test_server;

    beforeEach(function(done) {
        test_server = require('../server.js', {bustCache: true});
        test_server.db.User.remove({}, function() {
            test_server.db.Message.remove({}, done);
        });
    });

    afterEach(function(done) {
        test_server.server.close(function() {
            test_server.db.User.remove({}, function() {
                test_server.db.Message.remove({}, done);
        })});

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
                    console.log(res);
                    expect(res.status).to.equal(false);
                    done();
                });

                client2.emit('login', {username: 'u2', password: 'p1'});
            });
    });

    //it('should correctly log in', function(done) {
    //    request(test_server.server)
    //        .post('/createUser')
    //        .set('Content-Type', 'application/json')
    //        .send('{"username":"u1","password":"p1"}')
    //        .end(function() {
    //            var socket1 = require('socket.io-client');
    //            var client1 = socket1('http://localhost:3000/');
    //
    //            client1.on('login', function(res) {
    //                console.log(res);
    //                expect(res.status).to.equal(true);
    //                done();
    //            });
    //
    //            client1.emit('login', {username: 'u1', password: 'p1'});
    //        });
    //});
});

describe('socket send', function() {

    var test_server;

    beforeEach(function(done) {
        test_server = require('../server.js', {bustCache: true});
        test_server.db.User.remove({}, function() {
            test_server.db.Message.remove({}, done);
        });
    });

    afterEach(function(done) {
        test_server.server.close(function() {
            test_server.db.User.remove({}, function() {
                test_server.db.Message.remove({}, done);
            })});

    });

    it('should send a message', function(done) {
        // create user u1
        request(test_server.server)
            .post('/createUser')
            .set('Content-Type', 'application/json')
            .send('{"username":"u1","password":"p1"}')
            .end(function() {
                request(test_server.server)
                    .get('/userList')
                    .end(function() {
                        // create user u2
                        request(test_server.server)
                            .post('/createUser')
                            .set('Content-Type', 'application/json')
                            .send('{"username":"u2","password":"p2"}')
                            .end(function() {
                                var socket1 = require('socket.io-client');
                                var client1 = socket1('http://localhost:3000/');
                                var socket2 = require('socket.io-client');
                                var client2 = socket2('http://localhost:3000/');

                                client1.emit('login', {username: 'u1', password: 'p1'});

                                client2.emit('login', {username: 'u2', password: 'p2'});
                                client2.on('login', function() {
                                    client1.emit('send', {receiver: 'u2', message: 'testing'});
                                });

                                client2.on('receive', function() {
                                    done();
                                });

                            });
                    });
            });
    });

});