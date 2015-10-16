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
      status: ''
    }
  },
  handleLogin: function(data) {
    var username = data.username;
    var password = data.password;
    socket.emit('login', {username: username, password: password});
    socket.on('login', function(response) {
      if(response.status) {
        this.setState({
          page: 'chat'
        });
      } else if (!response.status) {
        console.log('fail: '+response.message);
        this.setState({
          status: response.message
        });
      }
    }.bind(this));

  },
  render: function() {
    var page = null;
    if (this.state.page === 'login') {
      page = (
        <div>
          <LoginPage handleLogin={this.handleLogin} />
          <span>{this.state.status}</span>
        </div>
      )
    } else if (this.state.page === 'chat') {
      page = (
        <ChatPage />
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
