/*****************************
      REQUIRED MODULES
******************************/

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  Modal
} from 'react-native';
import { Font } from 'exponent';
import { Container, Content, Button, Input } from 'native-base';
import { Ionicons } from '@exponent/vector-icons';

/*****************************
    (EXPORTED) CAPTION VIEW
******************************/

// variable required to retrieve JWT
var STORAGE_KEY = 'id_token';

export default class CaptionView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      caption: ''
    };
  }

  /*****************************
        modal functions
  ******************************/

  setVisibility(show) {
    // Accepts `true` or `false` to define visibility setting
    this.setState({visible: show});
  }

  save() {
    // Method called for SAVE button onPress
    this.updateCaption(this.state.caption);
    this.setState({visible: false});
  }

  async updateCaption(caption) {
    // Method that calls API endpoint to update image caption
    
    // Attempt to retrieve JWT stored in AsyncStorage
    try {
      var token = await AsyncStorage.getItem(STORAGE_KEY);
    } catch (error) {
      console.log('AsyncStorage error:', error.message);
    }

    // Attempt to access the `UPDATE CAPTION` endpoint
    fetch('https://dunkmasteralec.herokuapp.com/api/memories/updatecaption', {
      method: 'POST',
      body: 
        JSON.stringify({
          id: this.props.id,
          caption: this.state.caption
        }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    }).then(function(result) {
      console.log('Successfully updated caption!');
      this.props.updateCap(caption);
      console.log(result);
      this.props.caption = caption;
    }).catch(function(error) {
      console.log('Did not update caption :(');
      console.log(error);
    });
  }

  /*****************************
        rendered (jsx)
  ******************************/

  render() {
    return (
      <View>
        {/* rendered button on `memory` view */}
        <Button onPress={this.setVisibility.bind(this, true)}>
          <Text>Edit Caption</Text>
        </Button>

        {/* popup modal settings */}
        <Modal
          animationType={'slide'}
          transparent={true}
          visible={this.state.visible}
        >

          {/* modal view for editing captions */}
          <Content style={styles.modal}>
            <View>

              {/* [x] exit button to close the modal */}
              <Button transparent onPress={this.setVisibility.bind(this, false)}>
                <Ionicons name="ios-close" size={40} color="#444" />
              </Button>

              {/* caption editing field and save button */}
              <Input
                placeholder={this.props.caption}
                onChangeText={(text) => this.setState({caption: text})}
                value={this.state.caption}
              />
              <Button onPress={this.save.bind(this)}>
                <Text>Save</Text>
              </Button>

            </View>
          </Content>
        </Modal>
      </View>
    );
  }
}

/*****************************
    MODAL STYLESHEET
******************************/

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)'
  }
});
