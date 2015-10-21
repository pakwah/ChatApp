/**
 * Created by Jason on 10/16/2015.
 */

var React = require('react');
var $ = require('jquery');
var RBS = require('react-bootstrap');

var UserList = require('./UserList');
var MessageForm = require('./MessageForm');
var MessageList = require('./MessageList');

var ChatPage = React.createClass({
  getInitialState: function() {
    return {
      recipient: null,
      messages: []
    }
  },
  componentWillReceiveProps: function(newProps) {
    if(newProps.unreadCount[this.state.recipient] > 0) {
      this.props.clearUnread(this.state.recipient);
    }
    var newMessages = newProps.newMessages[this.state.recipient];
    if(typeof newMessages !== 'undefined' && newMessages.length > 0) {
        this.setState(function(prevState, curProps) {
          prevState.messages = prevState.messages.concat(newMessages);
          return prevState;
        });
        this.props.clearNewMessages(this.state.recipient);
      }
  },
  handleClickUser: function(data) {
    var username = data.username;
    this.setState({recipient: username});
    this.updateRecipient(username);
    this.props.clearUnread(username);
  },
  updateRecipient: function(recipient) {
    var url = '/history/' + this.props.username + '/' + recipient;
    $.ajax({
      url: url,
      type: 'GET',
      dataType: 'json',
      success: function(data) {
        this.props.clearNewMessages(this.props.username);
        this.setState({messages: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(err+': '+xhr.responseText);
      }.bind(this)
    });
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
            activeUsers={this.props.activeUsers} unreadCount={this.props.unreadCount} />
        </RBS.Col>
        <RBS.Col md={10} xs={10}>
          <h3>{this.state.recipient}</h3>
          <MessageList messages={this.state.messages} username={this.props.username}/>
          <footer style={{position:"fixed", bottom:"0"}}>
            <MessageForm handleMessage={this.handleSendMessage} />
          </footer>
        </RBS.Col>
      </div>
    )
  }
});

module.exports = ChatPage;
