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
        {this.props.activeUsers.indexOf(this.props.name) !== -1 ?
          <RBS.Glyphicon glyph="eye-open" /> :
          <RBS.Glyphicon glyph="eye-close" style={{color:"red"}} />
        } {this.props.name} {this.props.unreadCount > 0 ?
          <RBS.Badge>{this.props.unreadCount}</RBS.Badge> :
          null
        }
      </RBS.NavItem>
    )
  }
});

module.exports = UserNode;
