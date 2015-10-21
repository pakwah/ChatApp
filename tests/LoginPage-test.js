// Create a fake global `window` and `document` object:
require('./testdom')('<html><body></body></html>');

// Replace BigComplicatedComponent.js with a stub component.
global.reactModulesToStub = [];

var chai = require('chai');
var expect = chai.expect;
var sinonChai = require('sinon-chai');
var sinon = require('sinon');
chai.use(sinonChai);
var React = require('react');
var Login = require('../client/js/Login.js');
var TestUtils = require('react-addons-test-utils');

describe('CreateUser', function() {
  it('should pass an empty test', function() {
    expect(true).to.equal(true);
  });
  it('should submit credentials upon form submission', function() {
    var onDone = sinon.spy();
    var loginForm = TestUtils.renderIntoDocument(
      <Login handleLogin={onDone} alertVisible={false}
        status="Testing" />
    );
    var form = TestUtils.findRenderedDOMComponentWithTag(loginForm, 'form');
    loginForm.refs.username.getInputDOMNode().value = 'u1';
    loginForm.refs.password.getInputDOMNode().value = 'p1';
    TestUtils.Simulate.submit(form);
    expect(onDone).to.have.been.calledWith({username:'u1', password:'p1'});
  });
});
