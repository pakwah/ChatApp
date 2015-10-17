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
  getInitialState: function() {
    return {
      recipient: null
    }
  },
  handleClickUser: function(data) {
    var username = data.username;
    this.setState({recipient: username});
  },
  handleSendMessage: function(text) {
    if (this.state.recipient) {
      this.props.handleMessage({
        text: text,
        recipient: this.state.recipient
      });
    }
  },
  render: function() {
    return (
      <div>
        <UserList handleClickUser={this.handleClickUser}/>
        <h3>{this.state.recipient}</h3>
        <MessageForm handleMessage={this.props.handleMessage} />
      </div>
    )
  }
});

module.exports = ChatPage;
