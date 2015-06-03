'use strict';

var React = require('react-native');
var {
  View,
  Text,
  SwitchIOS,
  StyleSheet,
} = React;

var BluetoothLE = require('./BluetoothLE');

var ConnectionTab = React.createClass({
  statics: {
    title: 'Connection Tab',
    systemIcon: 'recents',
  },

  peripherals: [],
  autoConnection: 'ble_app_sample2',

  getInitialState() {
    return {
      enable: true,
      timer: null,
    };
  },

  componentDidMount: function() {
  },

  startBlinking: function(uuid: string) {
    var value = 0;

    this.timer = setInterval(() => {
      value ^= 255;
    }, 1000);
  },

  stopBlinking: function() {
    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timer = null;
  },

  render: function() {
    return (
      <View style={styles.tabContent}>
        <View style={styles.row}>
          <Text>Bluetooth Low Energy</Text>
          <SwitchIOS
            onValueChange={(value) => {
              this.setState({enable: value});
            }}
            value={this.state.enable} />
        </View>
        <BluetoothLE ble={this.props.data.ble} value={this.props.value} onUpdate={this.props.onUpdate} />
      </View>
    );
  },
});

var styles = StyleSheet.create({
  tabContent: {
    paddingTop: 20,
    paddingHorizontal: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

module.exports = ConnectionTab;
