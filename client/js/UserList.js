/**
 * Created by Jason on 10/16/2015.
 */

var React = require('react');
var $ = require('jquery');
var RBS = require('react-bootstrap');

var UserNode = React.createClass({
  onClick: function() {
    this.props.handleClickUser({username: this.props.name});
  },
  render: function() {
    return (
      <RBS.NavItem eventKey={this.props.name} onSelect={this.onClick} >
        {this.props.name} {this.props.activeUsers.indexOf(this.props.name) !== -1 ?
          <RBS.Glyphicon glyph="asterisk"/> :
          null
        }
      </RBS.NavItem>
    )
  }
});

var UserList = React.createClass({
  getInitialState: function() {
    return {
      users: []
    };
  },
  componentDidMount: function() {
    $.ajax({
      url: '/userList',
      type: 'GET',
      dataType: 'json',
      success: function(data) {
        this.setState({users: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(err+': '+xhr.responseText);
      }.bind(this)
    });
  },
  render: function() {
    var userNodes = this.state.users.map(function(user, index) {
      if (user.username !== this.props.username) {
        return (
          <UserNode name={user.username} handleClickUser={this.props.handleClickUser} key={index}
            activeUsers={this.props.activeUsers} />
        );
      }
    }, this);
    return (
      <div className="userList">
        <RBS.Nav bsStyle="tabs" stacked>
          <h2 className="text-center">Users</h2>
          {userNodes}
        </RBS.Nav>
      </div>
    );
  }
});

module.exports = UserList;
