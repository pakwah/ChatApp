/**
 * Created by Jason on 10/16/2015.
 */

var React = require('react');

var UserNode = React.createClass({
  render: function() {
    return (
      <div>
        <h3>
          {this.props.name}
        </h3>
      </div>
    )
  }
});

var UserList = React.createClass({
  render: function() {
    var userNodes = this.props.users.map(function(user, index) {
      return (
        <UserNode name={user.username} key={index} />
      );
    });
    return (
      <div className="userList">
        <h2>Users</h2>
        {userNodes}
      </div>
    );
  }
});

module.exports = UserList;
