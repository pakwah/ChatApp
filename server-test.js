/**
 * Created by Jason on 10/20/2015.
 */

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
      .expect(200, [{_id:"5621ac4905ec6fe012e264e3",username:"j"},{_id:"5621ac5105ec6fe012e264e4",username:"c"}], done);
  });
  it('404 everything else', function testPath(done) {
    request(server).get('/foo/bar').expect(404, done);
  });
});