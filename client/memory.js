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

    fetch('https://invalid-memories-greenfield.herokuapp.com/api/memories/upload', 
      {
        body: form,
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer ' + token
        }
      }).then(function(resp) {
        // resp will include memory id
        // TODO: getAnaylysis(id) --> fetch analysis from server /api/memories/id/:id

          // (:id is the memory id)
        return resp.json();
      });
  }

  getAnalysis(id) {
    fetch('https://invalid-memories-greenfield.herokuapp.com/api/memories/id/' + id, {
      method: 'GET'
    }).then(function(analysis) {
      //NOTE: Expecting analysis to be a string
      this.setState({details: analysis});
    });
  }

  render() {
    if (this.props.prevScene === 'Homescreen') {
      this.uploadPhoto();
    } else {
      // TODO: getAnalysis(this.props.id)
    }
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