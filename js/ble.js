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

  connect(name: string): Promise {
    return new Promise((resolve, reject) => {
      BLENative.connect(name, function(error) {
        if (error) {
          console.log(error);
          reject();
        } else {
          resolve();
        }
      })
    });
  }
}

mixInEventEmitter(BLE, {discover: true});

module.exports = BLE;
