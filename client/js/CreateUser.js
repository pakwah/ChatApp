var React = require('react');
var RBS = require('react-bootstrap');
var $ = require('jquery');

var CreateUser = React.createClass({
  getInitialState: function() {
    return {
      status: '',
      alertVisible: false,
      alertStyle: 'danger'
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
        this.setState({
          status: 'Successfully registered',
          alertStyle: 'success',
          alertVisible: true
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(err+': '+xhr.responseText);
        this.setState({
          status: xhr.responseText,
          alertStyle: 'danger',
          alertVisible: true,
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
          <RBS.Alert bsStyle={this.state.alertStyle}>{this.state.status}</RBS.Alert> :
          null
        }
      </form>
    );
  }
});

module.exports = CreateUser;
