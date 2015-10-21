// Create a fake global `window` and `document` object:
require('./testdom')('<html><body></body></html>');

var chai = require('chai');
var expect = chai.expect;
var sinonChai = require('sinon-chai');
var sinon = require('sinon');
chai.use(sinonChai);
var React = require('react');
var TestUtils = require('react-addons-test-utils');

global.reactModulesToStub = [];

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
  var server;
  var createForm;

  beforeEach(function() {
    sinon.xhr.supportsCORS = true;
    server = sinon.fakeServer.create();
    createForm = TestUtils.renderIntoDocument(<CreateUser />);
  });

  afterEach(function () {
    server.restore();
  });

  it('should let the user know they registered successfully', function() {
    server.respondWith('POST', '/createUser', [200, { "Content-Type": "text/html",
                                                    "Content-Length": 2 }, "OK"]);
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
});
