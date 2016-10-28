import Exponent from 'exponent';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  AlertIOS,
  AsyncStorage,
  TouchableHighlight,
  Image
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

  _navigate(sceneName, imageUri) {
    console.log('changing scenes!');
    this.props.navigator.push({
      name: sceneName,
      passProps: {
        'image': {uri: imageUri},
        'prevScene': 'Homescreen'
      }
    });
  }

  logout() {
    console.log('logout called');
    this._userLogout()
    .then(()=> {
      this.props.navigator.pop();
    })
    .catch((err)=>{
      console.log('error logging out', err);
    });
  }

  getImage() {
    // console.log('get image called');
    var oneImage = async function(){
      return Exponent.ImagePicker.launchImageLibraryAsync({});
    };
    oneImage().then((image)=> {
      if (!image.cancelled) {
        this._navigate('Memory', image.uri);
      }
    });
  }

  takeImage() {
    // Cannot be run on simulator as it does not have access to a camera
    var newImage = async function() {
      return Exponent.ImagePicker.launchCameraAsync({});
    };
    newImage().then((image) => {
      if (!image.cancelled) {
        this._navigate('Memory', image.uri);
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight onPress={() => this._navigate('Memories')}>
          <Text style={styles.textbox}>View All</Text>
        </TouchableHighlight> 

        <TouchableHighlight onPress={this.getImage.bind(this)}>
          <Text style={styles.textbox}>Upload Photo</Text>
        </TouchableHighlight> 

        <TouchableHighlight onPress={this.takeImage.bind(this)}>
          <Text style={styles.textbox}>Take Photo</Text>
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
