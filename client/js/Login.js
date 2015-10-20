var React = require('react');
var RBS = require('react-bootstrap');

var Login = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var username = this.refs.username.getValue().trim();
    var password = this.refs.password.getValue().trim();
    if (!username || !password) {
      return;
    }
    this.props.handleLogin({username: username, password: password});
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

module.exports = Login;
