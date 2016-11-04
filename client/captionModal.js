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
    this.setState({visible: false});
  }

  updateCaption(caption) {
    
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
