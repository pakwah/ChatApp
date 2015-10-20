/**
 * Created by Jason on 10/16/2015.
 */


var ReactDOM = require('react-dom');
var React = require('react');
var $ = require('jquery');
var io = require('socket.io-client');
var LoginPage = require('./js/LoginPage.js');
var ChatPage = require('./js/ChatPage.js');

var socket = io('http://localhost:3000/');


var App = React.createClass({
  getInitialState: function() {
    return {
      page: 'login',
      status: '',
      alertVisible: false,
      username: '',
      activeUsers: [],
      unreadCount: {},
      newMessages: {}
    }
  },
  componentDidMount: function() {
    socket.on('activeUsers', function(data) {
      this.setState({activeUsers: data.onlineUsers});
    }.bind(this));
    socket.on('receive', function(data) {
      this.setState(function(prevState, curProps) {
        if(prevState.unreadCount[data.sender] === undefined) {
          prevState.unreadCount[data.sender] = 1;
        } else {
          prevState.unreadCount[data.sender]++;
        }
        if(prevState.newMessages[data.sender] === undefined) {
          prevState.newMessages[data.sender] = [data];
        } else {
          prevState.newMessages[data.sender].push(data);
        }
        return prevState;
      });
    }.bind(this));
  },
  handleLogin: function(data) {
    var username = data.username;
    var password = data.password;
    socket.emit('login', {username: username, password: password});
    socket.on('login', function(response) {
      if(response.status) {
        this.setState({
          page: 'chat',
          username: username
        });
      } else if (!response.status) {
        console.error('fail: '+response.message);
        this.setState({
          status: response.message,
          alertVisible: true
        });
      }
    }.bind(this));
  },
  clearUnread: function(username) {
    this.setState(function(prevState, curProps) {
      prevState.unreadCount[username] = 0;
      return prevState;
    });
  },
  clearNewMessages: function(username) {
    this.setState(function(prevState, curProps) {
      prevState.newMessages[username] = [];
      return prevState;
    });
  },
  handleSendMessage: function(data) {
    var recipient = data.recipient;
    var text = data.text;
    var packet = {receiver: recipient, message: text};
    socket.emit('send', packet);
  },
  render: function() {
    var page = null;
    if (this.state.page === 'login') {
      page = (
        <LoginPage handleLogin={this.handleLogin} alertVisible={this.state.alertVisible}
          status={this.state.status} />
      )
    } else if (this.state.page === 'chat') {
      page = (
        <ChatPage handleMessage={this.handleSendMessage} username={this.state.username}
          activeUsers={this.state.activeUsers} unreadCount={this.state.unreadCount}
          clearUnread={this.clearUnread} newMessages={this.state.newMessages}
          clearNewMessages={this.clearNewMessages} />
      )
    }
    return (
      <div>
        {page}
      </div>
    )
  }
});

ReactDOM.render(
  <App />,
  document.getElementById('chatapp')
);
