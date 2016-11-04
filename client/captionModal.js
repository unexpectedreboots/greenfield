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
import { Container, Content, Button } from 'native-base';
import { Ionicons } from '@exponent/vector-icons';

/*****************************
    (EXPORTED) CAPTION VIEW
******************************/

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

  /*****************************
        rendered (jsx)
  ******************************/

  render() {
    return (
      <View>
        <Button onPress={this.setVisibility.bind(this, true)}>
          <Text>Edit Caption</Text>
        </Button>

        <Modal
          animationType={'slide'}
          transparent={true}
          visible={this.state.visible}
        >
          <Content>
            <View>
              
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

});
