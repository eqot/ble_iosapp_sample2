'use strict';

var React = require('react-native');
var {
  StyleSheet,
  SwitchIOS,
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
      enable: true,
      dataSource: ds.cloneWithRows(this.peripherals),
    };
  },

  render: function() {
    return (
      <View style={styles.tabContent}>
        <View style={styles.row}>
          <Text>Bluetooth Low Energy</Text>
          <SwitchIOS
            onValueChange={(value) => {
              this.setState({enable: value});
            }}
            value={this.state.enable} />
        </View>
        <ListView style={styles.list}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
        />
      </View>
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
  tabContent: {
    paddingTop: 20,
    flex: 1,
    justifyContent: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    paddingHorizontal: 14,
    justifyContent: 'space-between',
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
