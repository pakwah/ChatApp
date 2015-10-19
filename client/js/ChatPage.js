/**
 * Created by Jason on 10/16/2015.
 */

var React = require('react');
var RBS = require('react-bootstrap');

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

var MessageNode = React.createClass({
  render: function() {
    return (
      <p>
        {this.props.text}
      </p>
    )
  }
});

var MessageList = React.createClass({
  render: function() {
    var messageNodes = this.props.data.map(function(d) {
      return (
        <MessageNode text={d}/>
      )
    });
    return (
      <div>
        {messageNodes}
      </div>
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
    this.props.handleClickUser(username);
    this.setState({recipient: username});
  },
  handleSendMessage: function(text) {
    if (this.state.recipient) {
      var data = {
        text: text,
        recipient: this.state.recipient
      };
      this.props.handleMessage(data);
    }
  },
  render: function() {
    return (
      <div>
        <RBS.Col md={2} xs={2}>
          <UserList handleClickUser={this.handleClickUser} username={this.props.username}
            activeUsers={this.props.activeUsers} />
        </RBS.Col>
        <RBS.Col md={2} xsOffset={2} xs={2}>
          <h3>{this.state.recipient}</h3>
          <MessageForm handleMessage={this.handleSendMessage} />
        </RBS.Col>
        <MessageList data={this.props.messages} />
      </div>
    )
  }
});

module.exports = ChatPage;
