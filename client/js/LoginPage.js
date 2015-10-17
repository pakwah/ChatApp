var React = require('react');
var RBS = require('react-bootstrap');

var LoginOrCreate = React.createClass({
  render: function () {
    return (
      <div className="loginOrCreate">
        <RBS.PageHeader className="text-center">Chat Application</RBS.PageHeader>
        <RBS.Col md={2} xsOffset={1} xs={2}>
          <CreateUser />
        </RBS.Col>
        <RBS.Col md={2} xsOffset={2} xs={2}>
          <Login handleLogin={this.props.handleLogin} alertVisible={this.props.alertVisible}
            status={this.props.status} />
        </RBS.Col>
      </div>
    );
  }
});

var CreateUser = React.createClass({
  getInitialState: function() {
    return {
      status: '',
      alertVisible: false
    };
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var username = this.refs.username.getValue().trim();
    var password = this.refs.password.getValue().trim();
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
        this.setState({
          status: xhr.responseText,
          alertVisible: true
        });
      }.bind(this)
    });
    this.refs.username.value = '';
    this.refs.password.value = '';
    return;
  },
  render: function() {
    return (
      <form className="createUser" onSubmit={this.handleSubmit}>
        <h2>Register</h2>
        <RBS.Input type="text" placeholder="username" ref="username" />
        <RBS.Input type="password" placeholder="password" ref="password" />
        <RBS.ButtonInput type="submit" bsStyle="primary" value="Register" />
        {this.state.alertVisible ?
          <RBS.Alert bsStyle="danger">{this.state.status}</RBS.Alert> :
          null
        }
      </form>
    );
  }
});

var Login = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var username = this.refs.username.getValue().trim();
    var password = this.refs.password.getValue().trim();
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
        <h2>Login</h2>
        <RBS.Input type="text" placeholder="username" ref="username" />
        <RBS.Input type="password" placeholder="password" ref="password" />
        <RBS.ButtonInput type="submit" bsStyle="primary" value="Login" />
        {this.props.alertVisible ?
          <RBS.Alert bsStyle="danger">{this.props.status}</RBS.Alert> :
          null
        }
      </form>
    );
  }
});

module.exports = LoginOrCreate;
