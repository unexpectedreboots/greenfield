import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  AlertIOS,
  AsyncStorage,
  TouchableHighlight
} from 'react-native';

var STORAGE_KEY = 'id_token';

export default class Homescreen extends React.Component {
  constructor(props) {
    super(props);
  }

  async _userLogout() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      AlertIOS.alert("Logout Success!")
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
  }

  logout() {
    console.log('logout called');
    this._userLogout()
    .then(()=>{
      this.props.navigator.pop();
    })
    .catch((err)=>{
      console.log('error logging out', err);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight>
          <Text style={styles.textbox}>View All</Text>
        </TouchableHighlight> 

        <TouchableHighlight>
          <Text style={styles.textbox}>Upload Photo</Text>
        </TouchableHighlight> 

        <TouchableHighlight>
          <Text style={styles.textbox} onPress={this.logout.bind(this)}>Logout</Text>
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
