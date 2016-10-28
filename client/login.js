import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  Navigator,
  AlertIOS,
  AsyncStorage
} from 'react-native';
var t = require('tcomb-form-native');

var STORAGE_KEY = 'id_token';
var Form = t.form.Form;

var User = t.struct({
  username: t.Str,
  password: t.Str,
});

export default class Login extends React.Component {
  constructor(props) {
    super(props);
  }

  _navigate() {
    console.log('changing scenes!');
    this.props.navigator.push({
      name: 'Homescreen',
    })
  }
  
  async _onValueChange(item, selectedValue) {
    try {
      await AsyncStorage.setItem(item, selectedValue);
      console.log('token saved!');
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
  }

  login() {
    // check if username exits (make fetch to database) and check password to see if matches
    var context = this;
    var userInfo = this.refs.form.getValue();

    if (userInfo) {
      fetch('https://invalid-memories-greenfield.herokuapp.com/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: userInfo.username,
          password: userInfo.password
        })
      })
      .then(function(response) {
        if (response.status === 201) {
          var token = JSON.parse(response._bodyText).id_token;
          return context._onValueChange(STORAGE_KEY, token)
            .then(function() {
              context._navigate();
            });
        } else {
          AlertIOS.alert('USERNAME/PASSWORD IS INVALID, FOO!');
        }
      });
    }
  }

  signup() {
    var context = this;
    var userInfo = this.refs.form.getValue();

    if (userInfo) {
      fetch('https://invalid-memories-greenfield.herokuapp.com/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: userInfo.username,
          password: userInfo.password
        })
      })
      .then(function(response) {
        if (response.status === 201) {
          var token = JSON.parse(response._bodyText).id_token;
          return context._onValueChange(STORAGE_KEY, token)
            .then(function() {
              context._navigate();
            });
        } else {
          AlertIOS.alert('USERNAME ALREADY EXISTS, FOO!');
        }
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>{this.props.title}</Text>
        <Text>Selfsnap!</Text>
        <Form
          ref="form"
          type={User}
          options={{
            fields: {
              password: {
                password: true,
                secureTextEntry: true
              }
            }
          }}
        />

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

// to navigate between scenes
  // <TouchableHighlight onPress={ () => this._navigate()}>
  //   <Text> Go to homescreen</Text>
  // </TouchableHighlight>


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
