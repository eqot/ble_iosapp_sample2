'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
} = React;
var RCTNativeAppEventEmitter = require('RCTNativeAppEventEmitter');

var BLENative = require('NativeModules').BLENative;

var BluetoothLE = React.createClass({
  subscription: null,

  componentDidMount() {
    this.subscription = RCTNativeAppEventEmitter.addListener('discoverPeripheral', this.onDiscoverPeripheral);

    BLENative.startScanning();
  },

  componentWillUnmount() {
    this.subscription.remove();

    BLENative.stopScanning();
  },

  componentWillReceiveProps(nextProps) {
    var writeValue = nextProps.writeValue ? 0 : 255;
    this.write(nextProps.characteristicUuid, writeValue);
  },

  onDiscoverPeripheral(peripheral) {
    if (this.props.peripheralName === peripheral.name) {
      BLENative.stopScanning();

      this.connect(this.props.peripheralName);
    }
  },

  connect(name: string) {
    BLENative.connect(name, () => {
      this.discoverServices();
    });
  },

  discoverServices() {
    BLENative.discoverServices((services) => {
      this.discoverCharacteristics(this.props.serviceUuid);
    });
  },

  discoverCharacteristics(uuid: string) {
    BLENative.discoverCharacteristics(uuid, (characteristics) => {
      this.read(this.props.characteristicUuid);
    });
  },

  read(uuid: string) {
    BLENative.read(uuid, (value) => { this.props.onUpdate(value); });
  },

  write(uuid: string, value: integer) {
    BLENative.write(uuid, value, () => {});
  },

  render() {
    var writeValue = this.props.writeValue ? 'ON' : 'OFF';
    return (
      <Text>BluetoothLE {this.props.readValue} {writeValue}</Text>
    );
  }
});

module.exports = BluetoothLE;
