var require = require('really-need');
process.env.NODE_ENV = "test";
var request = require('supertest');

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

describe('loading express', function() {
  var server;
  beforeEach(function() {
    server = require('./../server', {bustCache: true});
  });
  afterEach(function() {
    server.close();
  });
  it('responds to /', function testSlash(done) {
    request(server).get('/').expect(200, done);
  });
  it('gets users from /userList', function testUserList(done) {
    request(server).get('/userList')
      .expect(200, [], done);
  });
  it('404 everything else', function testPath(done) {
    request(server).get('/foo/bar').expect(404, done);
  });
});