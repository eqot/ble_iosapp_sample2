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

var ConnectionTab = React.createClass({
  statics: {
    title: 'Connection Tab',
    systemIcon: 'recents',
  },

  peripherals: [],
  autoConnection: 'ble_app_sample2',

  ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),

  getInitialState() {
    return {
      enable: true,
      dataSource: this.ds.cloneWithRows(this.peripherals),
    };
  },

  componentDidMount: function() {
    this.ble = new BLE();
    this.ble.addListener('discover', this.onDiscoverPeripheral.bind(this));
    this.startScanning();
  },

  startScanning() {
    this.ble.startScanning();
  },

  stopScanning() {
    this.ble.stopScanning();
  },

  onDiscoverPeripheral: function(peripheral) {
    console.log(peripheral);

    this.peripherals.push(peripheral.name);
    this.setState({dataSource: this.ds.cloneWithRows(this.peripherals)});

    if (this.autoConnection && this.autoConnection === peripheral.name) {
      this.connect(peripheral.name);
    }
  },

  onSelectPeripheral: function(rowID: number) {
    this.stopScanning();
    this.connect(this.peripherals[rowID]);
  },

  connect: function(name) {
    this.ble.connect(name).then(() => {
      console.log('Connected');
    });
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
      <TouchableHighlight onPress={() => this.onSelectPeripheral(rowID)}>
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
