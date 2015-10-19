jest.dontMock('../client/js/Login.js');
jest.dontMock('../client/js/CreateUser.js');
jest.dontMock('react-bootstrap');

var ReactTestUtils = require('react-addons-test-utils');
var ReactDOM = require('react-dom');
var React = require('react');
var Login = require('../client/js/Login.js');

describe('CreateUser', function() {
  // var CreateUser = require('../client/js/CreateUser.js');
  it('should pass an empty test', function() {
    expect(true).toEqual(true);
  });
});

// describe('Login', function() {
//
// });
