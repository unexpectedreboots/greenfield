import Exponent from 'exponent';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight
} from 'react-native';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      username: 'sup'
    };
  }

  hello() {
    alert(this.state.username);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Hi Bill!</Text>
        <TextInput style={{height: 40, borderColor: 'gray', borderWidth: 1}} onChangeText={(newText)=>this.setState({username: newText})} value={this.state.username}/>
        <TouchableHighlight onPress={this.hello.bind(this)}>
          <Text style={{height: 40, borderColor: 'gray', borderWidth: 1}}>Button</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

Exponent.registerRootComponent(App);
