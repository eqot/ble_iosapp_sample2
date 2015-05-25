'use strict';

var BLENative = require('NativeModules').BLENative;
var RCTNativeAppEventEmitter = require('RCTNativeAppEventEmitter');

class BLE {
  constructor() {
    var subscription = RCTNativeAppEventEmitter.addListener(
      'discoverPeripheral',
      (peripheral) => {
        console.log(peripheral.name);
        console.log(peripheral.identifier);
      }
    );
  }

  startScanning() {
    BLENative.startScanning();
  }
}

module.exports = BLE;
