/**
 * Created by Jason on 10/13/2015.
 */

var React = require('react');
var ReactDOM = require('react-dom');

var LoginOrCreate = React.createClass({
  render: function () {
    return (
      <div className="loginOrCreate">
        <h1>Hello, world!</h1>
        <CreateUser />
        <Login />
      </div>
    );
  }
});

var CreateUser = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var username = this.refs.username.value.trim();
    var password = this.refs.password.value.trim();
    if(!username || !password) {
      return;
    }
    // TODO: send info to server and validate
    this.refs.username.value = '';
    this.refs.password.value = '';
    return;
  },
  render: function() {
    return (
      <form className="createUser" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="username" ref="username" />
        <input type="password" placeholder="password" ref="password" />
        <input type="submit" value="Submit" />
      </form>
    );
  }
});

var Login = React.createClass({
  render: function() {
    return (
      <div className="login">
        Insert things to login.
      </div>
    );
  }
});

ReactDOM.render(
    <LoginOrCreate />,
    document.getElementById('chatapp')
);
