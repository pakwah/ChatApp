// Via http://www.asbjornenge.com/wwc/testing_react_components.html
module.exports = function(markup) {
  if (typeof document !== 'undefined') return;
  var jsdom = require("jsdom").jsdom;
  global.document = jsdom(markup || '');
  global.window = document.defaultView;
  global.XMLHttpRequest = global.window.XMLHttpRequest;
  global.navigator = {
    userAgent: 'node.js'
  };
  // ... add whatever browser globals your tests might need ...
}
