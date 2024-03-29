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
global.reactModulesToStub = [];
/* End common test header */

describe('General Tests', function() {
  it('should pass an empty test', function() {
    expect(true).to.equal(true);
  });
});

describe('Login', function() {
  var Login = require('../client/js/Login.js');

  it('should submit credentials upon form submission', function() {
    var submit = sinon.spy();
    var loginForm = TestUtils.renderIntoDocument(
      <Login handleLogin={submit} alertVisible={false}
        status="Testing" />
    );
    var form = TestUtils.findRenderedDOMComponentWithTag(loginForm, 'form');
    loginForm.refs.username.getInputDOMNode().value = 'u1';
    loginForm.refs.password.getInputDOMNode().value = 'p1';
    TestUtils.Simulate.submit(form);
    expect(submit).to.have.been.calledWith({username:'u1', password:'p1'});
  });

  it('should display a customized error when signaled', function() {
    var loginForm = TestUtils.renderIntoDocument(
      <Login handleLogin={sinon.stub()} alertVisible={false}
        status="Error" />
    );
    expect(TestUtils.scryRenderedDOMComponentsWithClass(loginForm, 'alert')).to.be.empty;
    loginForm.setProps({
      alertVisible: true
    }, function() {
      expect(TestUtils.findRenderedDOMComponentWithClass(loginForm, 'alert').textContent).to.equal('Error');
    });
  });

  it('should not submit if password is blank', function() {
    var submit = sinon.spy();
    var loginForm = TestUtils.renderIntoDocument(
      <Login handleLogin={submit} alertVisible={false}
        status="Error" />
    );
    var form = TestUtils.findRenderedDOMComponentWithTag(loginForm, 'form');
    loginForm.refs.username.getInputDOMNode().value = 'u1';
    TestUtils.Simulate.submit(form);
    expect(submit).to.not.have.been.called;
  });

  it('should not submit if username is blank', function() {
    var submit = sinon.spy();
    var loginForm = TestUtils.renderIntoDocument(
      <Login handleLogin={submit} alertVisible={false}
        status="Error" />
    );
    var form = TestUtils.findRenderedDOMComponentWithTag(loginForm, 'form');
    loginForm.refs.password.getInputDOMNode().value = 'p1';
    TestUtils.Simulate.submit(form);
    expect(submit).to.not.have.been.called;
  });

  it('should remove leading/trailing whitespace from username and password', function() {
    var submit = sinon.spy();
    var loginForm = TestUtils.renderIntoDocument(
      <Login handleLogin={submit} alertVisible={false}
        status="Error" />
    );
    var form = TestUtils.findRenderedDOMComponentWithTag(loginForm, 'form');
    loginForm.refs.username.getInputDOMNode().value = ' u1 ';
    loginForm.refs.password.getInputDOMNode().value = ' p1 ';
    TestUtils.Simulate.submit(form);
    expect(submit).to.have.been.calledWith({username:'u1', password:'p1'});
  });
});

describe('CreateUser', function() {
  var CreateUser = require('../client/js/CreateUser.js');
  var $ = require('jquery');
  var createForm;
  var server;

  beforeEach(function() {
    createForm = TestUtils.renderIntoDocument(<CreateUser />);
    sinon.xhr.supportsCORS = true;
    server = sinon.fakeServer.create();
  });

  afterEach(function () {
    server.restore();
  });

  it('should not submit if username is blank', function() {
    var fakeAjax = sinon.stub($, "ajax");

    var form = TestUtils.findRenderedDOMComponentWithTag(createForm, 'form');
    createForm.refs.password.getInputDOMNode().value = 'p1';
    TestUtils.Simulate.submit(form);
    expect(fakeAjax).to.have.not.been.called;
    fakeAjax.restore();
  });

  it('should not submit if password is blank', function() {
    var fakeAjax = sinon.stub($, "ajax");

    var form = TestUtils.findRenderedDOMComponentWithTag(createForm, 'form');
    createForm.refs.username.getInputDOMNode().value = 'u1';
    TestUtils.Simulate.submit(form);
    expect(fakeAjax).to.have.not.been.called;
    fakeAjax.restore();
  });

  it('should remove leading/trailing whitespace from username and password', function() {
    var fakeAjaxData = sinon.spy();
    var fakeAjax = sinon.stub($, "ajax", function(args) {
      fakeAjaxData(args.data);
    });

    var form = TestUtils.findRenderedDOMComponentWithTag(createForm, 'form');
    createForm.refs.username.getInputDOMNode().value = ' u1 ';
    createForm.refs.password.getInputDOMNode().value = ' p1 ';
    TestUtils.Simulate.submit(form);
    expect(fakeAjaxData).to.have.been.calledWith(JSON.stringify({username: 'u1', password: 'p1'}));
    fakeAjax.restore();
  });

  it('should let the user know they registered successfully', function() {
    server.respondWith('POST', '/createUser', [200, {"Content-Type": "text/html",
                                                    "Content-Length": 2}, "OK"]);
    server.respondImmediately = true;

    var form = TestUtils.findRenderedDOMComponentWithTag(createForm, 'form');
    createForm.refs.username.getInputDOMNode().value = 'u1';
    createForm.refs.password.getInputDOMNode().value = 'p1';

    // no alert should be visible initially
    expect(TestUtils.scryRenderedDOMComponentsWithClass(createForm, 'alert')).to.be.empty;
    TestUtils.Simulate.submit(form);

    var alert = TestUtils.findRenderedDOMComponentWithClass(createForm, 'alert');
    expect(alert.props.bsStyle).to.equal('success');
    expect(alert.textContent).to.equal('Successfully registered');
  });

  it('should alert the user if registration failed', function() {
    server.respondWith('POST', '/createUser', [400, {"Content-Type": "text/html"},
                                                    "Username already exists"]);
    server.respondImmediately = true;

    var form = TestUtils.findRenderedDOMComponentWithTag(createForm, 'form');
    createForm.refs.username.getInputDOMNode().value = 'u1';
    createForm.refs.password.getInputDOMNode().value = 'p1';

    // no alert should be visible initially
    expect(TestUtils.scryRenderedDOMComponentsWithClass(createForm, 'alert')).to.be.empty;
    TestUtils.Simulate.submit(form);

    var alert = TestUtils.findRenderedDOMComponentWithClass(createForm, 'alert');
    expect(alert.props.bsStyle).to.equal('danger');
    expect(alert.textContent).to.equal('Username already exists');
  });
});

describe('MessageForm', function() {
  var MessageForm = require('../client/js/MessageForm');

  it('should submit message upon submission', function() {
    var submit = sinon.spy();
    var messageForm = TestUtils.renderIntoDocument(
      <MessageForm handleMessage={submit} />
    );
    var form = TestUtils.findRenderedDOMComponentWithTag(messageForm, 'form');
    messageForm.refs.text.getInputDOMNode().value = 'message';
    TestUtils.Simulate.submit(form);
    expect(submit).to.have.been.calledWith('message');
  });

  it('should trim whitespace at end', function() {
    var submit = sinon.spy();
    var messageForm = TestUtils.renderIntoDocument(
      <MessageForm handleMessage={submit} />
    );
    var form = TestUtils.findRenderedDOMComponentWithTag(messageForm, 'form');
    messageForm.refs.text.getInputDOMNode().value = 'message    ';
    TestUtils.Simulate.submit(form);
    expect(submit).to.have.been.calledWith('message');
  });

  it('should trim whitespace at beginning', function() {
    var submit = sinon.spy();
    var messageForm = TestUtils.renderIntoDocument(
      <MessageForm handleMessage={submit} />
    );
    var form = TestUtils.findRenderedDOMComponentWithTag(messageForm, 'form');
    messageForm.refs.text.getInputDOMNode().value = '   message';
    TestUtils.Simulate.submit(form);
    expect(submit).to.have.been.calledWith('message');
  });

  it('should not call handleSubmit if message empty', function() {
    var submit = sinon.spy();
    var messageForm = TestUtils.renderIntoDocument(
      <MessageForm handleMessage={submit} />
    );
    var form = TestUtils.findRenderedDOMComponentWithTag(messageForm, 'form');
    messageForm.refs.text.getInputDOMNode().value = '';
    TestUtils.Simulate.submit(form);
    expect(submit).to.not.have.been.called;
  });
});

describe('UserNode', function() {
  var UserNode = require('../client/js/UserNode.js');

  it('should call the callback when a user is clicked', function() {
    var callback = sinon.spy();
    var node = TestUtils.renderIntoDocument(<UserNode name="Joe" handleClickUser={callback} key="9"
      activeUsers={[]} unreadCount={0}/>);
    var navItem = TestUtils.findRenderedDOMComponentWithTag(node, 'li');
    TestUtils.Simulate.select(navItem);
    expect(callback).to.have.been.calledWith({username: "Joe"});
  });

  it('should display the correct indicator if a user is online', function() {
    var onlineUsers = ['Mike', 'Joe'];
    var node = TestUtils.renderIntoDocument(<UserNode name="Joe" handleClickUser={sinon.stub()} key="9"
      activeUsers={onlineUsers} unreadCount={0}/>);
    var glyphicon = TestUtils.findRenderedDOMComponentWithClass(node, 'glyphicon');
    expect(glyphicon.props.glyph).to.equal('eye-open');
  });

  it('should display the correct indicator if a user is offline', function() {
    var onlineUsers = ['Mike', 'Dan'];
    var node = TestUtils.renderIntoDocument(<UserNode name="Joe" handleClickUser={sinon.stub()} key="9"
      activeUsers={onlineUsers} unreadCount={0}/>);
    var glyphicon = TestUtils.findRenderedDOMComponentWithClass(node, 'glyphicon');
    expect(glyphicon.props.glyph).to.equal('eye-close');
  });

  it('should not display the unread badge when there are no unread messages', function() {
    var node = TestUtils.renderIntoDocument(<UserNode name="Joe" handleClickUser={sinon.stub()} key="9"
      activeUsers={[]} unreadCount={0}/>);
    expect(TestUtils.scryRenderedDOMComponentsWithClass(node, 'badge')).to.be.empty;
  });

  it('should display the unread count when there are unread messages', function() {
    var node = TestUtils.renderIntoDocument(<UserNode name="Joe" handleClickUser={sinon.stub()} key="9"
      activeUsers={[]} unreadCount={2}/>);
    var badge = TestUtils.findRenderedDOMComponentWithClass(node, 'badge');
    expect(badge.textContent).to.equal('2');
  });
});

describe('MessageNode', function() {
  var MessageNode = require('../client/js/MessageNode');

  it('should render component with timestamp on it', function() {
    var shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(
      <MessageNode message={{timestamp: 100, sender: 'u1'}}/>
    );
    var output = shallowRenderer.getRenderOutput();
    expect(output.type).to.equal('div');
    expect(output.props.children.length).to.equal(2);
    expect(output.props.children[0].type).to.equal('span');
    expect(output.props.children[0]).to.deep.equal(
      <span><b>{'u1'}</b><i>{"12/31/1969, 6:00:00 PM"}</i></span>
    );
    expect(output.props.children[1].type).to.equal('div');
    expect(output.props.children[1].children).to.be.undefined;
  });
});
