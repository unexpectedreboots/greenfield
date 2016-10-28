import Exponent from 'exponent';
import React from 'react';
import Login from './login';
import Homescreen from './homescreen';
import Memory from './memory';
import Memories from './memories';
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
      return <Login navigator={navigator} />;
    }
    if (route.name === 'Homescreen') {
      return <Homescreen navigator={navigator}/>;
    }
    if (route.name === 'Memory') {
      return <Memory navigator={navigator} {...route.passProps}/>;
    }
    if (route.name === 'Memories') {
      return <Memories navigator={navigator} {...route.passProps}/>;
    }
  }

  render() {
    return (
      <Navigator
        initialRoute={{ name: 'Login' }}
        renderScene={this.renderScene}
        navigationBar={
          <Navigator.NavigationBar
          routeMapper={{
            LeftButton: (route, navigator, index, navState) => {
              if (route.index === 0) {
                return null;
              } else {
                return (
                  <TouchableHighlight onPress={() => navigator.pop()}>
                    <Text style={{fontSize: 30}}>{'\<'}</Text>
                  </TouchableHighlight>
                );
              }
            },
            RightButton: (route, navigator, index, navState) => {
              
            },
            Title: (route, navigator, index, navState) => {
              return (<Text style={{fontSize: 30}}>Awesome Nav Bar</Text>);
            }
          }}
          style={{backgroundColor: 'gray'}}
          /> //Navigator.NavigationBar
        }
      /> //Navigator
    );
  }
}

Exponent.registerRootComponent(App);
