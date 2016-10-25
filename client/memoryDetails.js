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

export default class MemoryDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: this.props.image,
      details: ''
    };
  }

  render() {
    return (
      <View>
        <Image style={{width:200, height:200}} source={{uri: this.state.image.uri}}/>
      </View>
    );
  }
}