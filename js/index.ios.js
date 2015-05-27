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

var ConnectionTab = require('./connection_tab');

var tabs = [
  {
    component: ConnectionTab,
    render: function() {
      return (
        <ConnectionTab />
      )
    }
  },
];

var ble_iosapp_sample2 = React.createClass({
  getInitialState: function() {
    return {
      selectedTab: tabs[0].component.title
    };
  },

  render: function() {
    return (
      <TabBarIOS style={styles.container}>
        {tabs.map(function(tab, i) {
          return (
            <TabBarIOS.Item
              title={tab.component.title}
              systemIcon={tab.component.systemIcon}
              selected={this.state.selectedTab === tab.component.title}
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
