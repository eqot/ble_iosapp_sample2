'use strict';

var BLENative = require('NativeModules').BLENative;
var RCTNativeAppEventEmitter = require('RCTNativeAppEventEmitter');
var mixInEventEmitter = require('mixInEventEmitter');

class BLE {
  constructor() {
    var subscription = RCTNativeAppEventEmitter.addListener(
      'discoverPeripheral',
      (peripheral) => {
        this.emit('discover', peripheral);
      }
    );
  }

  startScanning() {
    BLENative.startScanning();
  }

  stopScanning() {
    BLENative.stopScanning();
  }
}

mixInEventEmitter(BLE, {discover: true});

module.exports = BLE;
