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
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
  }

  login() {
    // check if username exits (make fetch to database)
      // if it does exist, check password to see if matches
      // else, give error message password
    // else, give error message 

    alert(this.state.username);
    // login with this.state.username

    // else, signup user with this.state.username
  }

  signup() {
    // check if username exists (make fetch)
    // if it doesnt, create new user/password combo
    alert(this.state.password);
    // 
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Hi Bill!</Text>
        <TextInput style={styles.textbox} onChangeText={(text)=>this.setState({username: text})} value={this.state.username} placeholder="enter username here"/>
        <TextInput secureTextEntry={true} style={styles.textbox} onChangeText={(text)=>this.setState({password: text})} value={this.state.password} placeholder="enter password here"/>
        <TouchableHighlight onPress={this.login.bind(this)}>
          <Text style={styles.textbox}>Login</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.signup.bind(this)}>
          <Text style={styles.textbox}>Signup</Text>
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

  textbox: {
    height: 40, 
    borderColor: 'gray', 
    borderWidth: 1
  }
});

Exponent.registerRootComponent(App);
