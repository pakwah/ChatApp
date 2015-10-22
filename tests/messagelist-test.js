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
global.reactModulesToStub = ['MessageNode.js'];
//global.reactModulesToStub = [];
/* End common test header */

describe('MessageList', function() {
  var MessageList = require('../client/js/MessageList');
  var MessageNode = require('../client/js/MessageNode.js');

  it('should do something', function() {
    var shallowRenderer = TestUtils.createRenderer();
    var messages = [
      {sender: 'u1', timestamp: 100},
      {sender: 'u2', timestamp: 200}
    ];
    shallowRenderer.render(
      <MessageList messages={messages} />
    );
    var output = shallowRenderer.getRenderOutput();
    expect(output.type).to.equal('div');
    expect(output.props.children).to.deep.equal([
      <MessageNode message={{sender: 'u1', timestamp: 100}} key={0} />,
      <MessageNode message={{sender: 'u2', timestamp: 200}} key={1} />
    ]);
  });
});