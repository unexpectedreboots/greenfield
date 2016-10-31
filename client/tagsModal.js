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
      'helvetica': require('./assets/fonts/HelveticaNeueMed.ttf')
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
        <Content style={styles.modal}>
          <View style={styles.modalContent}>
            <Button transparent onPress={this.setModalVisible.bind(this, false)}>
              <Ionicons name="ios-close" size={40} color="#444" />
            </Button>
            <View><Text style={styles.modalText}>Select tags to save</Text></View>
            <View>
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
            </View>
            <View>
              <Button success onPress={this.onSubmit.bind(this)} style={styles.button}>
                <Text style={styles.buttonText}>Save</Text>
              </Button>
            </View>
          </View>
         </Content>
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
        <Text style={this.state.selected ? [styles.tagText, styles.tagSelected] : [styles.tagText, styles.tagNotSelected]}>{this.props.name}</Text>
      </Button>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)'
  },

  modalContent: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },

  modalText: {
    ...Font.style('montserrat'),
    fontSize: 30,
    color: '#444'
  },

  tagsContainer: {
    marginTop: 30,
    marginBottom: 10,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },

  button: {
    margin: 10,
    backgroundColor: '#f6755e'
  },

  buttonText: {
    ...Font.style('montserrat'),
    color: '#fff',
    fontSize: 18
  },

  tag: {
    margin: 10
  },

  tagText: {
    ...Font.style('helvetica'),
    fontSize: 16,
    letterSpacing: 1
  },

  tagSelected: {
    color: '#fff'
  },

  tagNotSelected: {
    color: '#25a2c3'
  }
});