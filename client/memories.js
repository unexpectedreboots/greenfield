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
import { Font } from 'exponent';
import { Container, Header, Title, Content, Footer, Button } from 'native-base';
import { Ionicons } from '@exponent/vector-icons';

var STORAGE_KEY = 'id_token';

export default class Memories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: {},
      imageList: [],
      fontLoaded: false
    };
  }

  async componentDidMount() {
    var context = this;
    await Font.loadAsync({
      'pacifico': require('./assets/fonts/Pacifico.ttf'),
    });
    this.setState({ fontLoaded: true });
    this.fetchMemories();
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

  // componentDidMount() {
  //   this.fetchMemories(); 
  // }

  render() {
    return (
      <Container>
        {
          this.state.fontLoaded ? (
        <Header>
          <Button 
            transparent
            onPress={() => this.props.navigator.pop()}
          >
            <Ionicons name="ios-arrow-back" size={32} style={{color: 'dodgerblue', marginTop: 5}}/>
          </Button>
          <Title style={styles.headerText}>{this.props.username}'s Memories</Title>
        </Header>
          ) : null
        }
        <Content contentContainerStyle={{
          flexWrap: 'wrap',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {
            this.state.imageList.map(image => 
              <TouchableHighlight onPress={this._navigate.bind(this, image)}>
                <Image style={styles.thumbnail} resizeMode={Image.resizeMode.contain} source={{uri: image.uri}}/>
              </TouchableHighlight>
            )
          }
        </Content>
      </Container>
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
  thumbnail: {
    width: 90,
    height: 90,
    margin: 1
  }
});
