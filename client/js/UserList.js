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
  getInitialState: function() {
    return {users: []};
  },
  componentDidMount: function() {
    $.ajax({
      url: '/userList',
      // contentType: 'application/json; charset=utf-8',
      type: 'GET',
      dataType: 'json',
      success: function(data) {
        console.log(data);
        this.setState({users: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(err+': '+xhr.responseText);
      }.bind(this)
    });
  },
  render: function() {
    var userNodes = this.state.users.map(function(user, index) {
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
