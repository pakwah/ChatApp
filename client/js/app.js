var LoginOrCreate = React.createClass({
  render: function () {
    return (
      <div className="loginOrCreate">
        <h1>Hello, world!</h1>
        <CreateUser url="/createUser" />
        <Login />
      </div>
    );
  }
});

var CreateUser = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var username = this.refs.username.value.trim();
    var password = this.refs.password.value.trim();
    if(!username || !password) {
      return;
    }
    // TODO: send info to server and validate
    $.ajax({
      url: this.props.url,
      contentType: 'application/json; charset=utf-8',
      type: 'POST',
      data: JSON.stringify({username: username, password: password}),
      success: function(data) {
        console.log('success');
      }.bind(this),
      error: function(xhr, status, err) {
        console.log(status);
        console.log(err+': '+xhr.responseText);
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
      </form>
    );
  }
});

var Login = React.createClass({
  render: function() {
    return (
      <div className="login">
        Insert things to login.
      </div>
    );
  }
});

ReactDOM.render(
    <LoginOrCreate />,
    document.getElementById('chatapp')
);
