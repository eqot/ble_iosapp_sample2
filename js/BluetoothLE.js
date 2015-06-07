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

  getInitialState() {
    return {
      value: 0,
    };
  },

  componentDidMount() {
    this.subscription = RCTNativeAppEventEmitter.addListener('discoverPeripheral', this.onDiscoverPeripheral);

    BLENative.startScanning();
  },

  componentWillUnmount() {
    this.subscription.remove();

    BLENative.stopScanning();
  },

  componentWillReceiveProps(nextProps) {
    var led_value = nextProps.led ? 0 : 255;
    this.write(nextProps.ble.characteristic_uuid, led_value);
  },

  onDiscoverPeripheral(peripheral) {
    if (this.props.ble.peripheral_name === peripheral.name) {
      BLENative.stopScanning();

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

      this.props.onUpdate(value);
    });
  },

  write(uuid: string, value: integer) {
    BLENative.write(uuid, value, () => {
    });
  },

  render() {
    var led_state = this.props.led ? 'ON' : 'OFF';
    return (
      <Text>BluetoothLE {this.props.value} {led_state}</Text>
    );
  }
});

module.exports = BluetoothLE;
