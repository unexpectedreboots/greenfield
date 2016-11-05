import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  AsyncStorage,
  Image,
  Vibration,
  TextInput
} from 'react-native';
import { Font } from 'exponent';
import ModalView from './tagsModal';
import { Container, Header, Title, Content, Footer, Button, Spinner } from 'native-base';
import { Ionicons } from '@exponent/vector-icons';
import { Components } from 'exponent';
import CaptionView from './captionModal';

var STORAGE_KEY = 'id_token';

export default class Memory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: this.props.image,
      tags: [],
      filteredTags: [],
      status: false,
      lat: this.props.latitude,
      lon: this.props.longitude,
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
      'montserrat': require('./assets/fonts/Montserrat-Regular.ttf'),
      'helvetica': require('./assets/fonts/HelveticaNeueMed.ttf')
    });
    this.setState({ fontLoaded: true });
    if (this.props.prevScene === 'Homescreen') {
      this.uploadPhoto();
    } else {
      this.getMemoryData(this.props.id, 0);
    }
    console.log(this.props.latitude, "compdidmount latitude");
  }

  async uploadPhoto() {
    var context = this;
    var photo = {
      uri: this.state.image.uri,
      type: 'image/jpeg',
      name: 'image.jpg'
    };
    var location = {
      latitude: this.state.latitude,
      longitude: this.state.longitude,
    }
    console.log(JSON.stringify(location), 'location line 67');
    try {
      var token =  await AsyncStorage.getItem(STORAGE_KEY);
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }

    var form = new FormData();
    form.append('memoryImage', photo);
    // form.append('location', location);
    fetch('https://dunkmasteralec.herokuapp.com/api/memories/upload', 
      {
        body: form,
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer ' + token
        }
      }).then(function(res) {
        // var memoryID = JSON.parse(res['_bodyText']);
        var databaseId = JSON.parse(res['_bodyInit']);
        console.log(context.props.latitude,"context.props.latitude before post");
        context.updateLoc(databaseId);
        context.getMemoryData(databaseId, 0);

      });
        
  }
  async updateLoc(id) {
    var context = this;
    try {
      var token =  await AsyncStorage.getItem(STORAGE_KEY);
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }

    fetch('https://dunkmasteralec.herokuapp.com/api/memories/id/' + id, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }).then(function(res) {
      var memory = JSON.parse(res['_bodyInit'])._id;
      console.log(memory, 'memory');
      fetch('https://dunkmasteralec.herokuapp.com/api/memories/uploadloc', 
        {
          method: 'POST',
          body: JSON.stringify({id: memory, lat: context.props.latitude, lon: context.props.longitude}),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          }
        }).then(function(res) { console.log('success 109') }).catch(function(err) {console.log('err123: ', err);});
    })
  };
  async getMemoryData(id, pings) {
    var context = this;
    try {
      var token =  await AsyncStorage.getItem(STORAGE_KEY);
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }

    fetch('https://dunkmasteralec.herokuapp.com/api/memories/id/' + id, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }).then(function(res) {
      var memory = JSON.parse(res['_bodyInit']);
      console.log(memory);
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
        caption: caption,
        lat: memory.lat,
        lon: memory.lon
      });
    }).catch(function(err) {
      console.log('ERROR', err);
      // Try pinging database again
      if (pings < 200) {
        context.getMemoryData(id, pings + 1);
      } else {
        var date = new Date().toString().slice(0, 15);
        context.setState({
          tags: [], 
          filteredTags: [], 
          status: true, 
          databaseId: id,
          date: date,
          caption: 'Request Timeout'
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

    fetch('https://dunkmasteralec.herokuapp.com/api/memories/id/' + this.state.databaseId, {
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

  async deleteMemory() {
    var context = this;
    try {
      var token =  await AsyncStorage.getItem(STORAGE_KEY);
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
    fetch('https://dunkmasteralec.herokuapp.com/api/memories/delete', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: this.state.databaseId
      })
    }).then(function(res) {
      console.log('success');
     context._navigate(); 
    }).catch(function(err) {
      
    })
  }

updateCap(caption) {
  this.setState({
    caption: caption
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
          <Button transparent onPress={() => {this.deleteMemory()}}>
            <Ionicons name="ios-trash" size={35} color="#444" />
          </Button>  
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
          <CaptionView 
            caption={this.state.caption}
            id={this.state.databaseId}
            updateCap={this.updateCap.bind(this)}
            />
          <MemoryDetails 
            status={this.state.status} 
            tags={this.state.filteredTags}
          />
          <DisplayMap lat={this.state.lat} lon={this.state.lon} />
          {loading}
        </Content>
      </Container>
    );
  }
}

class DisplayMap extends React.Component {
  constructor(props) {
    super(props)
  }

  static route = {
    navigationBar: {
      visible: false,
    },
  }

  render() {
    return (
      <Components.MapView
        style={styles.map}
        initialRegion={{
          latitude: this.props.lat,
          longitude: this.props.lon,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        }} 
      >
        <Components.MapView.Marker
          coordinate={
            {latitude: this.props.lat,
            longitude: this.props.lon}
          }
        />
      </Components.MapView>
    );
  }
}

class MemoryDetails extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    Vibration.vibrate();
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
              <Button style={styles.tag} rounded info><Text style={styles.tagText}>{tag}</Text></Button>
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

  tagText: {
    ...Font.style('helvetica'),
    color: '#fff',
    fontSize: 16,
    letterSpacing: 1
  },

  image: {
    width: 325,
    height: 325
  },

  spinner: {
    padding: 100
  },

  map: {
    // ...StyleSheet.absoluteFillObject,
    width: 200,
    height: 200,
    // top: 450,
    // left: 125
  }
});
