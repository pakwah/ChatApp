/**
 * Created by Jason on 10/16/2015.
 */

var React = require('react');
var $ = require('jquery');
var RBS = require('react-bootstrap');

var UserList = require('./UserList');

var MessageNode = React.createClass({
  render: function() {
    var timestamp = new Date(this.props.message.timestamp);
    return (
      <li>
        <span>
          <b>{this.props.message.sender} </b>
          <i>{timestamp.toLocaleString()}</i>
        </span>
        <div>{this.props.message.message}</div>
      </li>
    )
  }
});

var MessageForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var text = this.refs.text.getValue().trim();
    console.log(text);
    if (!text) {
      return;
    }
    this.refs.text.getInputDOMNode().value = '';
    this.props.handleMessage(text);
  },
  render: function() {
    return (
      <form className="form-inline" onSubmit={this.handleSubmit}>
        <RBS.Input type="text" placeholder="Type your message here" ref="text"/>
        <RBS.ButtonInput type="submit" value="Post" />
      </form>
    )
  }
});

var MessageList = React.createClass({
  render: function() {
    var messageNodes = this.props.data.map(function(d) {
      return (
        <MessageNode message={d} key={d._id}/>
      )
    });
    return (
      <div>
        {messageNodes}
      </div>
    )
  }
});

var ChatPage = React.createClass({
  getInitialState: function() {
    return {
      recipient: null
    }
  },
  handleClickUser: function(data) {
    var username = data.username;
    this.props.handleClickUser(username);
    this.setState({recipient: username});
  },
  handleSendMessage: function(text) {
    if (this.state.recipient) {
      var data = {
        text: text,
        recipient: this.state.recipient
      };
      this.props.handleMessage(data);
    }
  },
  render: function() {
    return (
      <div>
        <RBS.Col md={2}>
          <UserList handleClickUser={this.handleClickUser} username={this.props.username}
            activeUsers={this.props.activeUsers} />
        </RBS.Col>
        <RBS.Col md={10}>
          <h3>{this.state.recipient}</h3>
          <RBS.Row>
            <MessageList data={this.props.messages} />
          </RBS.Row>
          <RBS.Row style={{position:"fixed", bottom:"5px"}}>
            <MessageForm handleMessage={this.handleSendMessage} />
          </RBS.Row>
        </RBS.Col>
      </div>
    )
  }
});

module.exports = ChatPage;
