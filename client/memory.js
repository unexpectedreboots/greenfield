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

export default class Memory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: this.props.image,
      details: 'Loading...'
    };
  }

  async uploadPhoto() {
    // Send post to server with image
    var photo = {
      uri: this.state.image.uri,
      type: 'image/jpeg'
    };

    try {
      var token =  await AsyncStorage.getItem(STORAGE_KEY);
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }

    console.log('TOKEN', JSON.stringify(token));
    var form = new FormData();
    form.append('memoryImage', photo);
    console.log(form);

    fetch('http://localhost:3000/api/memories/upload', 
      {
        body: form,
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer ' + token
        }
      }).then(function(resp) {
        // send request for api data
        return resp.json();
      });
  }

  render() {
    this.uploadPhoto();
    return (
      <View>
        <Image style={{width:200, height:200}} source={{uri: this.state.image.uri}}/>
        <MemoryDetails details={this.state.details}/>
      </View>
    );
  }
}

class MemoryDetails extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <Text>{this.props.details}</Text>
      </View>
    );
  }
}