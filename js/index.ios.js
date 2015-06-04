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

var DATA = {
  ble: {
    peripheral_name:     'ble_app_sample2',
    service_uuid:        '00000001-9F36-4229-A17C-E62208FC5A6D',
    characteristic_uuid: '00000002-9F36-4229-A17C-E62208FC5A6D',
  },
};

var ble_iosapp_sample2 = React.createClass({
  getInitialState() {
    return {
      value: 0,
      // selectedTab: this.tabs[0].component.title
      selectedTabIndex: 0,
    };
  },

  onUpdate(value: integer) {
    this.setState({value: value});
  },

  render() {
    var self = this;
    var tabs = [
        {
          component: ConnectionTab,
          render() {
            return (
              <ConnectionTab data={DATA} onUpdate={self.onUpdate} value={self.state.value} />
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
