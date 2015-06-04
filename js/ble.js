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
      BLENative.connect(name, (error) => {
        if (error) {
          console.log(error);
          reject();
        } else {
          resolve();
        }
      })
    });
  }

  discoverServices(): Promise {
    return new Promise((resolve, reject) => {
      BLENative.discoverServices((services) => {
        resolve(services);
      })
    });
  }

  discoverCharacteristics(uuid: string): Promise {
    return new Promise((resolve, reject) => {
      BLENative.discoverCharacteristics(uuid, (characteristics) => {
        resolve(characteristics);
      })
    });
  }

  read(uuid: string): Promise {
    return new Promise((resolve, reject) => {
      BLENative.read(uuid, (value) => {
        resolve(value);
      })
    });
  }

  write(uuid: string, value: integer): Promise {
    return new Promise((resolve, reject) => {
      BLENative.write(uuid, value, () => {
        resolve();
      })
    });
  }
}

mixInEventEmitter(BLE, {discover: true});

module.exports = BLE;
