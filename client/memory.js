import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  AsyncStorage,
  Image
} from 'react-native';
import { Font } from 'exponent';
import ModalView from './tagsModal';
import { Container, Header, Title, Content, Footer, Button, Spinner } from 'native-base';
import { Ionicons } from '@exponent/vector-icons';

var STORAGE_KEY = 'id_token';

export default class Memory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: this.props.image,
      tags: [],
      filteredTags: [],
      status: false,
      databaseId: '',
      caption: ''
    };
  }

   _navigate() {
    this.props.navigator.push({
      name: 'Homescreen',
      passProps: {
        'username': this.props.username
      }
    });
  }

  async componentDidMount() {
    await Font.loadAsync({
      'pacifico': require('./assets/fonts/Pacifico.ttf'),
      'montserrat': require('./assets/fonts/Montserrat-Regular.ttf')
    });
    this.setState({ fontLoaded: true });
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
      var caption = [];
      // it isnt guranteed that microsoft will be before clarifai, correct?
      if (memory.analyses[0].tags && memory.analyses[0].tags.length > 0) {
        microsoftTags = memory.analyses[0].tags;
      }
      if (memory.analyses[1].tags && memory.analyses[1].tags.length > 0) {
        clarifaiTags = memory.analyses[1].tags;
      }

      if (memory.analyses[2].tags && memory.analyses[2].tags.length > 0) {
        caption = memory.analyses[2].tags[0].replace(/(\r\n|\n|\r)/gm, ' ').replace('.', '');
      }
      var analyses = _.uniq(microsoftTags.concat(clarifaiTags));
      var savedTags = memory.tags;
      var date = new Date(memory.createdAt).toString().slice(0, 15);
      context.setState({
        tags: analyses, 
        filteredTags: savedTags, 
        status: true, 
        databaseId: id,
        date: date,
        caption: caption
      });
    }).catch(function(err) {
      console.log('ERROR', err);
      // Try pinging database again
      if (pings < 50) {
        context.getMemoryData(id, pings + 1);
      } else {
        var date = new Date().toString().slice(0, 15);
        context.setState({
          tags: ['cant tag this right now sorry'], 
          filteredTags: ['cant tag this right now sorry'], 
          status: true, 
          statusMessage: 'Tags:',
          databaseId: id,
          date: date
        });
      }
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
      <Container>
        <Header>
          <Button transparent onPress={() => this.props.navigator.pop()}>
            <Ionicons name="ios-arrow-back" size={32} style={{color: '#25a2c3', marginTop: 5}}/>
          </Button>
          <Title style={styles.headerText}>{this.state.date}</Title>
          <Button transparent onPress={this._navigate.bind(this)}>
            <Ionicons name="ios-home" size={35} color="#444" />
          </Button>
        </Header>
        <Content 
          contentContainerStyle={
            {
              justifyContent: 'center',
              alignItems: 'center'
            }
          }>
          <Image style={styles.image} resizeMode={Image.resizeMode.contain} source={{uri: this.state.image.uri}}/>
          <Text style={styles.caption}>{this.state.caption}</Text>
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
        style={styles.spinner}>
      </Spinner>
      : null;
    return (
      <View>
        <View style={styles.tagsContainer}>
          {
            this.props.tags.map(tag =>
              <Button style={styles.tag} rounded info>{tag}</Button>
            )
          }
        </View>
        {loading}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerText: {
    ...Font.style('pacifico'),
    fontSize: 30,
    color: '#444',
    paddingTop: 25
  },

  tagsContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    flex: 1
  },

  caption: {
    ...Font.style('montserrat'),
    fontSize: 16,
    textAlign: 'center',
    margin: 10
  },

  tag: {
    margin: 10
  },

  image: {
    width: 325,
    height: 325
  },

  spinner: {
    padding: 100
  }
});