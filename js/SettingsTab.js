'use strict';

var React = require('react-native');
var {
  View,
  SwitchIOS,
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
    this.props.navigator.push({
      component: SettingDetailView,
      title: this.props.settings[id].name,
      passProps: {
        settings: this.props.settings[id]
      },
    });
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

var SettingDetailView = React.createClass({
  getInitialState() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var params = [
      {
        name: 'Color',
        items: ['#0000ff', '#00ff00', '#ff0000'],
      },
      {
        name: 'Pattern',
        items: ['Standard', 'Quick', 'Slow'],
      },
      {
        name: 'Vibrator',
        items: true,
      },
    ];

    return {
      dataSource: ds.cloneWithRows(params),
    };
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
    var item = null;
    if (Array.isArray(rowData.items)) {
      item = <Text>aaa</Text>
    } else if (typeof(rowData.items) === 'boolean') {
      item = <SwitchIOS />
    }
    return (
      <View style={styles.row}>
        <Text>{rowData.name}</Text>
        {item}
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
