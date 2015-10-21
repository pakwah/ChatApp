/**
 * Created by Jason on 10/20/2015.
 */


process.env.NODE_ENV = "test";
var request = require('supertest');

describe('loading express', function() {
  var server;
  beforeEach(function() {
    server = require('./server');
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