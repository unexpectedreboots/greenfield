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

  fetch() {
    var context = this;
    setTimeout(function() {
      context.setState({details: 'DONE.'});
      console.log('new details', context.state.details);
    }, 3000);
  }

  render() {
    this.fetch();
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