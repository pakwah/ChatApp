/* Begin common test header */
// Create a fake global `window` and `document` object:
require('./testdom')('<html><body></body></html>');

var chai = require('chai');
var expect = chai.expect;
var sinonChai = require('sinon-chai');
var sinon = require('sinon');
chai.use(sinonChai);
var React = require('react');
var TestUtils = require('react-addons-test-utils');

// add anything that you want to stub
global.reactModulesToStub = ['UserNode.js'];
/* End common test header */

describe('UserList', function() {
  var UserList = require('../client/js/UserList.js');
  var $ = require('jquery');
  var server;

  beforeEach(function() {
    sinon.xhr.supportsCORS = true;
    server = sinon.fakeServer.create();
  });

  afterEach(function() {
    server.restore();
  });

  it('should request the list of users from the server', function() {
    var fakeAjax = sinon.stub($, "ajax");
    TestUtils.renderIntoDocument(<UserList handleClickUser={sinon.stub()} username={'Joe'}
      activeUsers={[]} unreadCount={0} />);
    expect(fakeAjax).to.have.been.called;
    fakeAjax.restore();
  });

  it('should render a node for each user other than the current user', function() {
    server.respondWith('GET', '/userList', [200, {"Content-Type": "application/json"},
      '[{"username":"Joe"}, {"username":"Dave"}, {"username":"Mary"}, {"username":"Kevin"}]']);
    server.respondImmediately = true;

    var list = TestUtils.renderIntoDocument(<UserList handleClickUser={sinon.stub()} username={'Joe'}
      activeUsers={[]} unreadCount={0} />);

    var nav = TestUtils.findRenderedDOMComponentWithClass(list, 'nav');

    // 3 users other than the current user and one header
    expect(nav.props.children).to.have.length(4);
  });
});
