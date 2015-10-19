var React = require('react');
var RBS = require('react-bootstrap');
var CreateUser = require('./CreateUser.js');
var Login = require('./Login.js');

var LoginOrCreate = React.createClass({
  render: function () {
    return (
      <div className="loginOrCreate">
        <RBS.PageHeader className="text-center">Chat Application</RBS.PageHeader>
        <RBS.Col md={2} xsOffset={1} xs={2}>
          <Login handleLogin={this.props.handleLogin} alertVisible={this.props.alertVisible}
            status={this.props.status} />
        </RBS.Col>
        <RBS.Col md={2} xsOffset={2} xs={2}>
          <CreateUser />
        </RBS.Col>
      </div>
    );
  }
});

module.exports = LoginOrCreate;
