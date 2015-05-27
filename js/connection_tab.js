'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  ListView,
  TouchableHighlight,
  Text,
  View,
} = React;

var BLE = require('./ble');
this.ble = new BLE();

this.ble.addListener('discover', (peripheral) => {
  console.log(peripheral);

  if (peripheral.name === 'ble_app_sample2') {
    this.ble.connect(peripheral.name).then(() => {
      console.log('Connected');
    });
  }
});

this.ble.startScanning();
// this.ble.stopScanning();

var ConnectionTab = React.createClass({
  statics: {
    title: 'Connection Tab',
    systemIcon: 'recents',
  },

  peripherals: [],

  getInitialState() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds.cloneWithRows(this.peripherals),
    };
  },

  render: function() {
    return (
      <ListView style={styles.list}
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
      />
    );
  },

  renderRow: function(rowData: string, sectionID: number, rowID: number) {
    return (
      <TouchableHighlight onPress={() => this.onPressRow(rowID)}>
        <View>
          <View style={styles.listrow}>
            <Text style={styles.text}>
              {rowData}
            </Text>
          </View>
          <View style={styles.separator} />
        </View>
      </TouchableHighlight>
    );
  },
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  list: {
    flex: 1,
  },
  listrow: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#f6f6f6',
  },
  text: {
    flex: 1,
    paddingHorizontal: 14,
  },
  separator: {
    height: 1,
    backgroundColor: '#cccccc',
  },
});

module.exports = ConnectionTab;
