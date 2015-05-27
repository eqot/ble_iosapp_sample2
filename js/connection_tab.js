'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
} = React;

var BLE = require('./ble');
this.ble = new BLE();

this.ble.addListener('discover', (peripheral) => {
  console.log(peripheral);

  if (peripheral.name === 'ble_app_sample2') {
    this.ble.connect(peripheral.name).then(() => {
      console.log('Connected');
    });
  }
});

this.ble.startScanning();
// this.ble.stopScanning();

var ConnectionTab = React.createClass({
  statics: {
    title: 'Connection Tab',
    systemIcon: 'recents',
  },

  render: function() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.ios.js
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+Control+Z for dev menu
        </Text>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

module.exports = ConnectionTab;
