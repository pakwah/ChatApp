/**
 * Created by Jason on 10/21/2015.
 */


require('./testdom')('<html><body></body></html>');

var chai = require('chai');
var expect = chai.expect;
var sinonChai = require('sinon-chai');
var sinon = require('sinon');
chai.use(sinonChai);
var React = require('react');
var TestUtils = require('react-addons-test-utils');

// add anything that you want to stub
global.reactModulesToStub = ['../client/js/UserList.js'];
/* End common test header */

describe('ChatPage', function() {
  var ChatPage = require('../client/js/ChatPage.js')

  it('')
});
