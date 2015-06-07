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

  componentDidMount() {
    this.startBlinking();
  },

  componentWillUnmount() {
    this.stopBlinking();
  },

  startBlinking(uuid: string) {
    this.timer = this.setInterval(() => {
      this.setState({led: !this.state.led});
    }, 1000);
  },

  stopBlinking() {
    if (this.timer) {
      this.clearInterval(this.timer);
    }

    this.timer = null;
  },

  render() {
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
          peripheralName     = {this.props.ble.peripheralName}
          serviceUuid        = {this.props.ble.serviceUuid}
          characteristicUuid = {this.props.ble.characteristicUuid}
          readValue          = {this.props.value}
          writeValue         = {this.state.led}
          onUpdate           = {this.props.onUpdate}
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
