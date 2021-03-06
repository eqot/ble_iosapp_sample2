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
var BluetoothLE = require('./BluetoothLE');

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
      timer: null,
      dataSource: this.ds.cloneWithRows(this.peripherals),
    };
  },

  componentDidMount: function() {
    // this.ble = new BLE();
    // this.ble.addListener('discover', this.onDiscoverPeripheral.bind(this));
    // this.startScanning();
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
    this.ble.connect(name)
      .then(this.ble.discoverServices)
      .then((services) => {
        for (var i = 0, l = services.length; i < l; i++) {
          if (services[i] === '00000001-9F36-4229-A17C-E62208FC5A6D') {
            this.ble.discoverCharacteristics(services[i])
              .then((characteristics) => {
                console.log(characteristics);

                this.ble.read(characteristics[1])
                  .then((value) => {
                    console.log(value);
                  });

                this.startBlinking(characteristics[1]);
              });
          }
        }
      });
  },

  startBlinking: function(uuid: string) {
    var value = 0;

    this.timer = setInterval(() => {
      this.ble.write(uuid, value);
      value ^= 255;
    }, 1000);
  },

  stopBlinking: function() {
    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timer = null;
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
        <BluetoothLE
          peripheral    ={'ble_app_sample2'}
          service       ={'00000001-9F36-4229-A17C-E62208FC5A6D'}
          characteristic={'00000002-9F36-4229-A17C-E62208FC5A6D'}
          />
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
