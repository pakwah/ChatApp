/**
 * Created by Jason on 10/21/2015.
 */

var React = require('react');

var MessageNode = React.createClass({
  render: function() {
    var timestamp = new Date(this.props.message.timestamp);
    return (
      <div>
        <span>
          <b>{this.props.message.sender} </b>
          <i>{timestamp.toLocaleString()}</i>
        </span>
        <div style={{fontSize:"20px"}}>{this.props.message.message}</div>
      </div>
    )
  }
});

module.exports = MessageNode;
