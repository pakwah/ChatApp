/**
 * Created by Jason on 10/21/2015.
 */

var React = require('react');
var MessageNode = require('./MessageNode');

var MessageList = React.createClass({
  componentWillReceiveProps: function() {
    this.forceUpdate();
  },
  componentDidUpdate: function() {
    var objDiv = document.getElementById("messageList");
    objDiv.scrollTop = objDiv.scrollHeight;
  },
  render: function() {
    var messageNodes = this.props.messages.map(function(message, index) {
      return (
        <MessageNode message={message} key={index}/>
      )
    }, this);
    return (
      <div id="messageList" className="container" style={{overflowY:"auto", maxHeight:"750px", width:"100%"}}>
        {messageNodes}
      </div>
    )
  }
});

module.exports = MessageList;
