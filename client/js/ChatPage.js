/**
 * Created by Jason on 10/16/2015.
 */

var React = require('react');

var UserList = require('./UserList');

var MessageForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var text = this.refs.text.value.trim();
    if (!text) {
      return;
    }
    this.props.handleMessage(text);
    this.refs.text.value = '';
  },
  render: function() {
    return (
      <form className="messageForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Type your message here" ref="text" />
        <input type="submit" value="Post" />
      </form>
    )
  }
});

var ChatPage = React.createClass({
  handleClickUser: function(data) {
    console.log(data);
  },
  render: function() {
    return (
      <div>
        <MessageForm handleMessage={this.props.handleMessage} />
        <UserList handleClickUser={this.handleClickUser}/>
      </div>
    )
  }
});

module.exports = ChatPage;
