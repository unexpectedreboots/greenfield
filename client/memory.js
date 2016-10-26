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
      status: 'Loading...',
      tags: []
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
        var databaseId = JSON.parse(resp['_bodyInit']);
        this.getAnaylysis(databaseId);
      });
  }

  getAnalysis(id) {
    fetch('https://invalid-memories-greenfield.herokuapp.com/api/memories/id/' + id, {
      method: 'GET'
    }).then(function(analysis) {
      //NOTE: Expecting analysis to be an array
      this.setState({tags: analysis, status: 'Tags:'});
    });
  }

  componentDidMount() {
    if (this.props.prevScene === 'Homescreen') {
      this.uploadPhoto();
    } else {
      this.getAnalysis(this.props.id);
    }
  }

  render() {
    return (
      <View>
        <Image style={{width:200, height:200}} source={{uri: this.state.image.uri}}/>
        <MemoryDetails status={this.state.status} tags={this.state.tags}/>
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
        <Text>{this.props.status}</Text>
        {this.props.tags.map(tag => <Text>{tag}</Text>)}
      </View>
    );
  }
}