'use strict';

var React = require('react-native');
var {
  View,
  Text,
  TouchableHighlight,
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

  pressRow(id) {
    console.log(id);
  },

  render() {
    return (
      <View style={styles.container}>
        <ListView style={styles.listView}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
        />
      </View>
    );
  },

  renderRow(rowData, sectionId: number, rowId: number) {
    return (
      <TouchableHighlight onPress={() => this.pressRow(rowId)} >
        <View style={styles.row}>
          <Text>{rowData.name}</Text>
          <Text style={styles.arrow}> > </Text>
        </View>
      </TouchableHighlight>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 0.2,
  },
  arrow: {
    color: 'gray',
  }
});

module.exports = SettingsTab;
