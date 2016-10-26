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
        // resp will include memory id
        // TODO: getAnaylysis(id) --> fetch analysis from server /api/memories/id/:id
        makeAPIcalls();
          // (:id is the memory id)
        return resp.json();
      });
  }

  getAnalysis(id) {
    this.makeAPIcalls();
    // fetch('https://invalid-memories-greenfield.herokuapp.com/api/memories/id/' + id, {
    //   method: 'GET'
    // }).then(function(analysis) {
    //   //NOTE: Expecting analysis to be an array
    //   this.setState({tags: analysis});
        this.setState({status: 'Tags:'});
    // });
  }

  makeAPIcalls() {
    var context = this;
    //TODO: MOVE
    var clarifaiToken = 'NJLX0qdAqLAqFaveSs99SW0wr8rbLY';
    fetch('https://api.clarifai.com/v1/tag/?url=' + this.state.image.uri, {
      method: 'GET',
      // data: {
      //   url: this.state.image.uri
      // },
      headers: {
        'Authorization': 'Bearer ' + clarifaiToken
      }
    }).then(function(res) {
      var tags = JSON.parse(res['_bodyInit']).results[0].result.tag.classes;
      context.setState({tags: tags});
    })
  }

  componentDidMount() {
    if (this.props.prevScene === 'Homescreen') {
      this.uploadPhoto();
    } else {
      // TODO: getAnalysis(this.props.id)
      this.getAnalysis();
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