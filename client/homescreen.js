import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight
} from 'react-native';

export default class Homescreen extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight>
          <Text style={styles.textbox}>View All</Text>
        </TouchableHighlight> 

        <TouchableHighlight>
          <Text style={styles.textbox}>Upload Photo</Text>
        </TouchableHighlight> 

        <TouchableHighlight>
          <Text style={styles.textbox} onPress={ () => this.props.navigator.pop() }>Logout</Text>
        </TouchableHighlight> 
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  textbox: {
    height: 40, 
    borderColor: 'gray', 
    borderWidth: 1
  }
});
