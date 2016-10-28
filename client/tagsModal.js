import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  AlertIOS,
  AsyncStorage,
  TouchableHighlight,
  Image,
  Modal
} from 'react-native';
import { Container, Content, Button } from 'native-base';

export default class ModalView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      filteredTags: []
    };
  }

  componentDidMount() {
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
        <Button onPress={this.setModalVisible.bind(this, true)} bordered>Edit Tags</Button>
        <Modal
          animationType={'slide'}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => { alert('Modal has been closed.'); }}
        >
        <Container style={{backgroundColor: 'rgba(255, 255, 255, 0.9)'}}>
          <Content>
            {
              this.props.tags.map(tag => 
                <Tag 
                  name={tag}
                  addTag={this.addTag.bind(this)}
                  removeTag={this.removeTag.bind(this)}
                />
              )
            }
            <Button 
              success 
              onPress={this.onSubmit.bind(this)}
            >
              Submit
            </Button>
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
      >
        {this.props.name}
      </Button>
    );
  }
}
