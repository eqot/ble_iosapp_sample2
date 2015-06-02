'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
} = React;
var RCTNativeAppEventEmitter = require('RCTNativeAppEventEmitter');

var BLENative = require('NativeModules').BLENative;

var BluetoothLE = React.createClass({
  componentDidMount: function() {
    console.log(this.props.peripheral);
    console.log(this.props.service);
    console.log(this.props.characteristic);

    var subscription = RCTNativeAppEventEmitter.addListener(
      'discoverPeripheral', (peripheral) => {
        console.log(peripheral);
        if (this.props.peripheral === peripheral.name) {
          this.connect(this.props.peripheral);
        }
      }
    );

    BLENative.startScanning();
  },

  connect: function(name: string) {
    BLENative.connect(name, (error) => {
      if (error) {
        console.log(error);
        return;
      }

      console.log('ok');
    });
  },

  render() {
    return (
      <Text>BluetoothLE</Text>
    );
  }
});

module.exports = BluetoothLE;
