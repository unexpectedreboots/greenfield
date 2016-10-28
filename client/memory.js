import React, { Component } from 'react';
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
import ModalView from './tagsModal';
import { Container, Content, Button, Spinner } from 'native-base';

var STORAGE_KEY = 'id_token';

export default class Memory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: this.props.image,
      tags: [],
      filteredTags: [],
      status: false,
      databaseId: ''
    };
  }

  componentDidMount() {
    if (this.props.prevScene === 'Homescreen') {
      this.uploadPhoto();
    } else {
      this.getMemoryData(this.props.id);
    }
  }

  async uploadPhoto() {
    var context = this;
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
      }).then(function(res) {
        var databaseId = JSON.parse(res['_bodyInit']);
        context.getMemoryData(databaseId);
      });
  }

  async getMemoryData(id) {
    var context = this;
    try {
      var token =  await AsyncStorage.getItem(STORAGE_KEY);
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }

    fetch('https://invalid-memories-greenfield.herokuapp.com/api/memories/id/' + id, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }).then(function(res) {
      var memory = JSON.parse(res['_bodyInit']);
      var microsoftTags = [];
      var clarifaiTags = [];
      if (memory.analyses[0] === null) {
        microsoftTags = memory.analyses[0].tags;
      }
      if (memory.analyses[1] === null) {
        clarifaiTags = memory.analyses[1].tags;
      }
      var analyses = microsoftTags.concat(clarifaiTags);
      var savedTags = memory.tags;
      context.setState({
        tags: analyses, 
        filteredTags: savedTags, 
        status: true, 
        statusMessage: 'Tags:',
        databaseId: id
      });
    }).catch(function(err) {
      console.log('ERROR', err);
      // Try pinging database again
      context.getMemoryData(id);
    });
  }

  async updateTags(filteredTags) {
    this.setState({
      filteredTags: filteredTags
    });

    try {
      var token =  await AsyncStorage.getItem(STORAGE_KEY);
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }

    fetch('https://invalid-memories-greenfield.herokuapp.com/api/memories/id/' + this.state.databaseId, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tags: this.state.filteredTags
      })
    }).catch(function(err) {
      
    })
  }

  render() {
    var loading = this.state.status ? 
      <ModalView 
        prevScene={this.props.prevScene} 
        tags={this.state.tags} 
        updateTags={this.updateTags.bind(this)}
        status={this.state.status}
      />
      : null;
    return (
      <Container style={{paddingTop: 70}}>
        <Content>
          <Image style={{width:200, height:200}} source={{uri: this.state.image.uri}}/>
          <MemoryDetails 
            status={this.state.status} 
            tags={this.state.filteredTags}
          />
          {loading}
        </Content>
      </Container>
    );
  }
}

class MemoryDetails extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var loading = !this.props.status ?
      <Spinner 
        color='red' 
        animating={true} 
        size='large'
        style={{padding: 100}}>
      </Spinner>
      : null;
    return (
      <View style={{flex: 1}}>       
        {
          this.props.tags.map(tag => 
            <Button rounded info>{tag}</Button>
          )
        }
        {loading}
      </View>
    );
  }
}