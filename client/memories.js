import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  AlertIOS,
  AsyncStorage,
  TouchableHighlight,
  Image
} from 'react-native';

var STORAGE_KEY = 'id_token';

export default class Memories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: {},
      imageList: []
    };
  }

  _navigate(image) {
    console.log('changing scenes!');
    this.props.navigator.push({
      name: 'Memory',
      passProps: {
        'image': {uri: image.uri},
        'id': image.id,
        'prevScene': 'Memories'
      }
    });
  }

  async fetchMemories() {
    var context = this;
    try {
      var token =  await AsyncStorage.getItem(STORAGE_KEY);
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }

    fetch('https://invalid-memories-greenfield.herokuapp.com/api/memories/all', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    .then(function(memories) {
      var memoryArray = JSON.parse(memories['_bodyInit']);
      var images = memoryArray.map(memory => {
        return {
          id: memory._id,
          uri: memory.filePath
        };
      });
      context.setState({imageList: images});
    });
  }

  componentDidMount() {
    this.fetchMemories(); 
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        {this.state.imageList.map(image => 
          <TouchableHighlight onPress={this._navigate.bind(this, image)}>
            <Image style={styles.thumbnail} source={{uri: image.uri}}/>
          </TouchableHighlight>)}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 70,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  thumbnail: {
    width: 90,
    height: 90,
    margin: 1
  }
});
