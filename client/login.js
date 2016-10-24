
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  Navigator
} from 'react-native';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
  }

  _navigate() {
    this.props.navigator.push({
      name: 'Homescreen'
      // passProps: {
        // pass in props here if needed
      // }
    })
  }

  login() {
    // check if username exits (make fetch to database) and check password to see if matches
    
    // if (usernameExists(this.state.username) && passwordMatch(this.state.password)) {
    //   navigate to next scene

    // } else {
    //   give error message "invalid username or password"
    // }
  }

  signup() {
    // check if username exists (make fetch)
    // if it doesnt, create new user/password combo

    // if (!usernameExists(this.state.username)) {
    //   post(username, password);
    // }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>{this.props.title}</Text>
        <Text>Selfsnap!</Text>
        <TouchableHighlight onPress={ () => this._navigate()}>
          <Text> Go to homescreen</Text>
        </TouchableHighlight>
        <TextInput 
          style={styles.textbox} 
          onChangeText={(text)=>this.setState({username: text})} 
          value={this.state.username} 
          placeholder="enter username here"/>
        <TextInput 
          secureTextEntry={true} 
          style={styles.textbox} 
          onChangeText={(text)=>this.setState({password: text})} 
          value={this.state.password} 
          placeholder="enter password here"/>

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
