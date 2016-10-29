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

export default class ModalView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      filteredTags: []
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      'montserrat': require('./assets/fonts/Montserrat-Regular.ttf'),
    });
    this.setState({ fontLoaded: true });
    if (this.props.prevScene === 'Homescreen') {
      this.setState({modalVisible: true});
    } else {
      this.setState({modalVisible: false});
    }
  }

  setModalVisible(show) {
    this.setState({modalVisible: show});
  }

  addTag(tag) {
    var updatedTags = this.state.filteredTags;
    updatedTags.push(tag);
    this.setState({
      filteredTags: updatedTags
    });
  }

  removeTag(tag) {
    var updatedTags = this.state.filteredTags;
    updatedTags.splice(updatedTags.indexOf(tag), 1);
    this.setState({
      filteredTags: updatedTags
    });
  }

  onSubmit() {
    this.props.updateTags(this.state.filteredTags);
    this.setState({
      filteredTags: []
    });
    this.setState({modalVisible: false});
  }

  render() {
    return (
      <View>
        <Button onPress={this.setModalVisible.bind(this, true)} style={styles.button}>
          <Text style={styles.buttonText}>Edit Tags</Text>
        </Button>
        <Modal
          animationType={'slide'}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => { alert('Modal has been closed.'); }}
        >
        <Container style={styles.modal}>
          <Content
          contentContainerStyle={
            {
              marginTop: 20,
              justifyContent: 'center',
              alignItems: 'center'
            }
          }>
            <Button transparent onPress={this.setModalVisible.bind(this, false)}>
              <Ionicons name="ios-close" size={40} color="#444" />
            </Button>
            <View style={styles.tagsContainer}>
              {
                this.props.tags.map(tag => 
                  <Tag 
                    name={tag}
                    addTag={this.addTag.bind(this)}
                    removeTag={this.removeTag.bind(this)}
                  />
                )
              }
            </View>
            <View>
              <Button success onPress={this.onSubmit.bind(this)} style={styles.button}>
                Submit
              </Button>
            </View>
          </Content>
         </Container>
        </Modal>
      </View>
    );
  }
}

class Tag extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false,
      allTags: []
    };
  }

  selectTag() {
    this.setState({
      selected: !this.state.selected
    });
    if (!this.state.selected) {
      this.props.addTag(this.props.name);
    } else {
      this.props.removeTag(this.props.name);
    }
  }

  render() {
    return (
      <Button 
        bordered={!this.state.selected} 
        rounded 
        info
        onPress={this.selectTag.bind(this)}
        style={styles.tag}
      >
        {this.props.name}
      </Button>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)'
  },

  tagsContainer: {
    marginTop: 50,
    flexWrap: 'wrap',
    flexDirection: 'row'
  },

  button: {
    margin: 10,
    backgroundColor: '#f6755e'
  },

  buttonText: {
    ...Font.style('montserrat'),
    color: '#fff'
  },

  tag: {
    margin: 10
  }
});