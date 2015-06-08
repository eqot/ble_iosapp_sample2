'use strict';

var React = require('react-native');
var {
  View,
  Text,
  ListView,
  NavigatorIOS,
  StyleSheet,
} = React;

var SettingsTab = React.createClass({
  statics: {
    title: 'Settings',
    systemIcon: 'featured',
  },

  render() {
    return (
      <NavigatorIOS
        style={styles.container}
        initialRoute={{
          component: SettingView,
          title: 'Settings',
          passProps: { settings: this.props.settings },
        }}
      />
    );
  }
});

var SettingView = React.createClass({
  getInitialState() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds.cloneWithRows(this.props.settings),
    };
  },

  render() {
    return (
      <View style={styles.container}>
        <ListView style={styles.listView}
          dataSource={this.state.dataSource}
          renderRow={
            (rowData) => <Text>{rowData.name}</Text>
          }
        />
      </View>
    );

  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listView: {
    flex: 1,
  },
});

module.exports = SettingsTab;
