/**
 * Created by Jason on 10/16/2015.
 */

var React = require('react');
var $ = require('jquery');
var RBS = require('react-bootstrap');

var UserNode = React.createClass({
  getInitialState: function() {
    return {
      clickedUser: ''
    }
  },
  onClick: function(e) {
    e.preventDefault();
    this.setState({clickedUser: this.props.name});
    this.props.handleClickUser({username: this.props.name});
  },
  render: function() {
    return (
      <RBS.ListGroupItem onClick={this.onClick} >
        {this.props.name} {this.props.activeUsers.indexOf(this.props.name) !== -1 ?
          <RBS.Glyphicon glyph="asterisk"/> :
          null
        }
      </RBS.ListGroupItem>
    )
  }
});

var UserList = React.createClass({
  getInitialState: function() {
    return {
      users: [],
      selected: -1
    };
  },
  componentDidMount: function() {
    $.ajax({
      url: '/userList',
      // contentType: 'application/json; charset=utf-8',
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
        <h2 className="text-center">Users</h2>
        <RBS.ListGroup>
          {userNodes}
        </RBS.ListGroup>
      </div>
    );
  }
});

module.exports = UserList;
