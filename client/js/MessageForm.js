/**
 * Created by Jason on 10/21/2015.
 */

var React = require('react');
var RBS = require('react-bootstrap');

var MessageForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var text = this.refs.text.getValue().trim();
    if (!text) {
      return;
    }
    this.refs.text.getInputDOMNode().value = '';
    this.props.handleMessage(text);
  },
  render: function() {
    return (
      <form onSubmit={this.handleSubmit}>
        <RBS.Input type="text" placeholder="Type your message here" ref="text"
          buttonAfter={<RBS.Button onClick={this.handleSubmit}>Post</RBS.Button>}
          style={{paddingRight:"10px"}}/>
      </form>
    )
  }
});

module.exports = MessageForm;
