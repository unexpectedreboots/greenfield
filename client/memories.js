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
      imageList: [
        {
          id: '',
          uri: 'https://s3-us-west-1.amazonaws.com/invalidmemories/images/9961254d-064c-48ea-9ed5-060772f0199b-large.jpg'
        },
        {
          id: '',
          uri: 'http://www.nextavenue.org/wp-content/uploads/2015/08/The-People-You-Meet-While-Traveling-466243609.jpg'
        },
        {
          id: '',
          uri: 'http://www.simplyrecipes.com/wp-content/uploads/2016/10/2016-10-04-PumpkinIceCream-9.jpg'
        }
      ]
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
      <ScrollView style={styles.container}>
        {this.state.imageList.map(image => 
          <TouchableHighlight onPress={this._navigate.bind(this, image)}>
            <Image style={{width:150, height:150}} source={{uri: image.uri}}/>
          </TouchableHighlight>)}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'space-around',
  }
});
