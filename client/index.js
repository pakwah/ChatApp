/**
 * Created by Jason on 10/16/2015.
 */


var ReactDOM = require('react-dom');
var React = require('react');
var LoginPage = require('./js/LoginPage.js');
var ChatPage = require('./js/ChatPage.js');


var App = React.createClass({
  getInitialState: function() {
    return {
      page: 'login'
    }
  },
  handleLogin: function(data) {
    var username = data.username;
    var password = data.password;
    this.setState({
      page: 'chat'
    });
  },
  render: function() {
    var page = null;
    if (this.state.page === 'login') {
      page = (
        <LoginPage handleLogin={this.handleLogin} />
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
