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
    var photo = {
      uri: this.state.image.uri,
      type: 'image/jpeg',
      name: 'image.jpg'
    };

    try {
      var token =  await AsyncStorage.getItem(STORAGE_KEY);
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }

    var form = new FormData();
    form.append('memoryImage', photo);

    fetch('http://localhost:3000/api/memories/upload', 
      {
        body: form,
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer ' + token
        }
      }).then(function(resp) {
        // resp will include memory id
        // TODO: fetch analysis from server /api/memories/id/:id
          // (:id is the memory id)
        return resp.json();
      });
  }

  render() {
    // TODO: uploadPhoto() should be in a conditional of whether they came from the memories or upload/take photo page
    console.log('ALSDFJALKSDF');
    console.log('NAVIGATOR', this.props.navigator);
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