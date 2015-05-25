'use strict';

var BLENative = require('NativeModules').BLENative;

class BLE {
  startScanning() {
    BLENative.startScanning();
  }
}

module.exports = BLE;
