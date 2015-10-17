/**
 * Created by Jason on 10/16/2015.
 */

var React = require('react');

var UserNode = React.createClass({
  onClick: function(e) {
    e.preventDefault();
    this.props.handleClickUser({username: this.props.name});
  },
  render: function() {
    return (
      <div>
        <button onClick={this.onClick} >
          {this.props.name}
        </button>
      </div>
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
      return (
        <UserNode name={user.username} handleClickUser={this.props.handleClickUser} key={index}/>
      );
    }, this);
    return (
      <div className="userList">
        <h2>Users</h2>
        {userNodes}
      </div>
    );
  }
});

module.exports = UserList;
