/**
 * Created by Jason on 10/16/2015.
 */

var React = require('react');
var $ = require('jquery');
var RBS = require('react-bootstrap');

var UserList = require('./UserList');

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
