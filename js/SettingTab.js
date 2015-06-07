'use strict';

var React = require('react-native');
var {
  View,
  Text,
  NavigatorIOS,
  StyleSheet,
} = React;

var SettingTab = React.createClass({
  statics: {
    title: 'Setting',
    systemIcon: 'featured',
  },

  render() {
    return (
      <NavigatorIOS
        initialRoute={{
          component: SettingView,
          title: 'Setting',
          passProps: { myProp: 'foo' },
        }}
      />
    );
  }
});

var SettingView = React.createClass({
  render() {
    return (
      <Text>Test</Text>
    );
  }
});

module.exports = SettingTab;
