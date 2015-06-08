/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  TabBarIOS,
} = React;

var ConnectionTab = require('./ConnectionTab');
var SettingTab    = require('./SettingTab');

var ble_iosapp_sample2 = React.createClass({
  getInitialState() {
    return {
      ble: {
        peripheralName:     'ble_app_sample2',
        serviceUuid:        '00000001-9F36-4229-A17C-E62208FC5A6D',
        characteristicUuid: '00000002-9F36-4229-A17C-E62208FC5A6D',
      },
      value: 0,
      selectedTabIndex: 0,
      setting: [
        {
          name: 'Incoming call',
          enabled: true,
          color: '#ff0000',
          pattern: 'standard',
          vibrator: true,
        },
        {
          name: 'Mail',
          enabled: true,
          color: '#00ff00',
          pattern: 'standard',
          vibrator: true,
        },
        {
          name: 'SNS',
          enabled: false,
          color: '#0000ff',
          pattern: 'standard',
          vibrator: false,
        },
      ]
    };
  },

  onUpdate(value: integer) {
    this.setState({value: value});
  },

  render() {
    var self = this;
    var tabs = [
        {
          component: SettingTab,
          render() {
            return (
              <SettingTab ble={self.state.ble} setting={self.state.setting} />
            )
          }
        },
        {
          component: ConnectionTab,
          render() {
            return (
              <ConnectionTab ble={self.state.ble} onUpdate={self.onUpdate} value={self.state.value} />
            )
          }
        },
      ];

    return (
      <TabBarIOS style={styles.container}>
        {tabs.map((tab, i) => {
          return (
            <TabBarIOS.Item
              title={tab.component.title}
              systemIcon={tab.component.systemIcon}
              selected={this.state.selectedTabIndex === i}
              onPress={() => {
                this.setState({
                  selectedTab: tab.component.title,
                });
              }}
              key={tab.component.title}
              >
              {tab.render()}
            </TabBarIOS.Item>
          );
        }, this)}
      </TabBarIOS>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

AppRegistry.registerComponent('ble_iosapp_sample2', () => ble_iosapp_sample2);
