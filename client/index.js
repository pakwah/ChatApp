/**
 * Created by Jason on 10/16/2015.
 */


var ReactDOM = require('react-dom');
var React = require('react');
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
      activeUsers: []
    }
  },
  componentDidMount: function() {
    socket.on('activeUsers', function(data) {
      this.setState({activeUsers: data.onlineUsers});
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
          activeUsers={this.state.activeUsers} />
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
