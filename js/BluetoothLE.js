'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
} = React;
var RCTNativeAppEventEmitter = require('RCTNativeAppEventEmitter');

var BLENative = require('NativeModules').BLENative;

var BluetoothLE = React.createClass({
  getInitialState() {
    return {
      value: 0,
    };
  },

  componentDidMount() {
    RCTNativeAppEventEmitter.addListener('discoverPeripheral', this.onDiscoverPeripheral);

    BLENative.startScanning();
  },

  onDiscoverPeripheral(peripheral) {
    if (this.props.ble.peripheral_name === peripheral.name) {
      this.connect(this.props.ble.peripheral_name);
    }
  },

  connect(name: string) {
    BLENative.connect(name, () => {
      this.discoverServices();
    });
  },

  discoverServices() {
    BLENative.discoverServices((services) => {
      this.discoverCharacteristics(this.props.ble.service_uuid);
    });
  },

  discoverCharacteristics(uuid: string) {
    BLENative.discoverCharacteristics(uuid, (characteristics) => {
      this.read(this.props.ble.characteristic_uuid);
    });
  },

  read(uuid: string) {
    BLENative.read(uuid, (value) => {
      this.setState({value: value});
    });
  },

  write(uuid: string, value: integer) {
    BLENative.write(uuid, value, () => {
    });
  },

  render() {
    return (
      <Text>BluetoothLE {this.state.value}</Text>
    );
  }
});

module.exports = BluetoothLE;
