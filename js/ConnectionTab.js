'use strict';

var React = require('react-native');
var {
  View,
  Text,
  SwitchIOS,
  StyleSheet,
} = React;
var TimerMixin = require('react-timer-mixin');

var BluetoothLE = require('./BluetoothLE');

var ConnectionTab = React.createClass({
  mixins: [TimerMixin],

  statics: {
    title: 'Connection Tab',
    systemIcon: 'recents',
  },

  peripherals: [],
  autoConnection: 'ble_app_sample2',

  getInitialState() {
    return {
      enable: true,
      led: false,
    };
  },

  componentDidMount: function() {
    this.startBlinking();
  },

  componentWillUnmount() {
    this.stopBlinking();
  },

  startBlinking: function(uuid: string) {
    this.timer = this.setInterval(() => {
      this.setState({led: !this.state.led});
    }, 1000);
  },

  stopBlinking: function() {
    if (this.timer) {
      this.clearInterval(this.timer);
    }

    this.timer = null;
  },

  render: function() {
    var led_state = this.state.led ? 'ON' : 'OFF';
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
        <BluetoothLE
          ble={this.props.data.ble}
          value={this.props.value}
          led={this.state.led}
          onUpdate={this.props.onUpdate}
        />
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
