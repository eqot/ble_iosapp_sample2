'use strict';

var React = require('react-native');
var {
  View,
  Text,
  ListView,
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
        style={styles.container}
        initialRoute={{
          component: SettingView,
          title: 'Setting',
          passProps: { setting: this.props.setting },
        }}
      />
    );
  }
});

var SettingView = React.createClass({
  getInitialState() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds.cloneWithRows(this.props.setting),
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

module.exports = SettingTab;
