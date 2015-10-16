var React = require('react');

var LoginOrCreate = React.createClass({
  render: function () {
    return (
      <div className="loginOrCreate">
        <h1>Hello, world!</h1>
        <CreateUser />
        <Login handleLogin={this.props.handleLogin} />
      </div>
    );
  }
});

var CreateUser = React.createClass({
  getInitialState: function() {
    return {status: ''};
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var username = this.refs.username.value.trim();
    var password = this.refs.password.value.trim();
    if(!username || !password) {
      return;
    }
    $.ajax({
      url: '/createUser',
      contentType: 'application/json; charset=utf-8',
      type: 'POST',
      data: JSON.stringify({username: username, password: password}),
      success: function(data) {
        console.log('success');
        this.setState({status:'Successfully registered'});
      }.bind(this),
      error: function(xhr, status, err) {
        console.log(status);
        console.log(err+': '+xhr.responseText);
        this.setState({status:xhr.responseText});
      }.bind(this)
    });
    this.refs.username.value = '';
    this.refs.password.value = '';
    return;
  },
  render: function() {
    return (
      <form className="createUser" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="username" ref="username" />
        <br/>
        <input type="password" placeholder="password" ref="password" />
        <br/>
        <input type="submit" value="Submit" />
        <br/>
        <span>{this.state.status}</span>
      </form>
    );
  }
});

var Login = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var username = this.refs.username.value.trim();
    var password = this.refs.password.value.trim();
    if (!username || !password) {
      return;
    }
    this.props.handleLogin({username: username, password: password});
    this.refs.username.value = '';
    this.refs.password.value = '';
  },
  render: function() {
    return (
      <form className="login" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="username" ref="username" />
        <br/>
        <input type="password" placeholder="password" ref="password" />
        <br/>
        <input type="submit" value="Submit" />
      </form>
    );
  }
});

module.exports = LoginOrCreate;
