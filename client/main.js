import Exponent from 'exponent';
import React from 'react';
import Login from './login';
import Homescreen from './homescreen';
import MemoryDetails from './memoryDetails';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  Navigator
} from 'react-native';

class App extends React.Component {
  renderScene(route, navigator) {
    if (route.name === 'Login') {
      return <Login navigator={navigator} />
    }
    if (route.name === 'Homescreen') {
      return <Homescreen navigator={navigator}/>
    }
    if (route.name === 'MemoryDetails') {
      return <MemoryDetails navigator={navigator} {...route.passProps}/>
    }
  }

  render() {
    return (
      <Navigator
        initialRoute={{ name: 'Login' }}
        renderScene={this.renderScene}
      />
    );
  }
}

Exponent.registerRootComponent(App);
