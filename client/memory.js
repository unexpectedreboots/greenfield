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

var STORAGE_KEY = 'id_token';

export default class Memory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: this.props.image,
      status: 'Loading...',
      tags: [],
      selectedTags: []
    };
  }

  async uploadPhoto() {
    var context = this;
    var photo = {
      uri: this.state.image.uri,
      type: 'image/jpeg',
      name: 'image.jpg'
    };

    try {
      var token =  await AsyncStorage.getItem(STORAGE_KEY);
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }

    var form = new FormData();
    form.append('memoryImage', photo);
    fetch('https://invalid-memories-greenfield.herokuapp.com/api/memories/upload', 
      {
        body: form,
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer ' + token
        }
      }).then(function(resp) {
        var databaseId = JSON.parse(resp['_bodyInit']);
        context.getMemoryData(databaseId);
      });
  }

  async getMemoryData(id) {
    var context = this;
    try {
      var token =  await AsyncStorage.getItem(STORAGE_KEY);
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }

    fetch('https://invalid-memories-greenfield.herokuapp.com/api/memories/id/' + id, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }).then(function(memory) {
      var analyses = JSON.parse(memory['_bodyInit']).analyses[0].tags;
      context.setState({tags: analyses, status: 'Tags:'});
    }).catch(function(err) {
      console.log('ERROR', err);
      // Try pinging database again
      context.getMemoryData(id);
    });
  }

  selectTag(tagName) {
    if (this.state.selectedTags.indexOf(tagName) === -1) {
      var newSelectedTags = this.state.selectedTags.concat(tagName);
      this.setState({
        selectedTags: newSelectedTags
      });
    }
  }

  setSelectedTags(tagArray) {
    this.setState({
      selectedTags: tagArray
    });
  }

  componentDidMount() {
    if (this.props.prevScene === 'Homescreen') {
      this.uploadPhoto();
    } else {
      this.getMemoryData(this.props.id);
    }
  }

  render() {
    return (
      <View>
        <ModalView tags={this.state.tags} addOneTag={this.selectTag.bind(this)} tagClickFunc={this.setSelectedTags.bind(this)}/>
        <Image style={{width:200, height:200}} source={{uri: this.state.image.uri}}/>
        <MemoryDetails status={this.state.status} tags={this.state.selectedTags}/>
      </View>
    );
  }
}

class MemoryDetails extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log('TAGS TO RENDER', this.props.tags);
    return (
      <View>
        <Text>{this.props.status}</Text>
        {this.props.tags.map(tag => <Text>{tag}</Text>)}
      </View>
    );
  }
}

class ModalView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      selectedTags: []
    };
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  componentDidMount() {
    this.setModalVisible(!this.state.modalVisible)
  }

  setSelectedTags(tagArray) {
    this.setState({
      selectedTags: tagArray
    });
  }

  render() {
    return (
      <View style={{marginTop: 22}}>
        <Modal
          animationType={"slide"}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {alert("Modal has been closed.")}}
          >
         <View style={{marginTop: 22, backgroundColor: 'rgba(255, 255, 255, 0.9)', flex: 1}}>
            <TagList tags={this.props.tags} addOneTag={this.props.addOneTag} setTagsInModalView={this.setSelectedTags.bind(this)} tagClickFunc={this.props.tagClickFunc}/>
            <TouchableHighlight onPress={() => {
              // this.props.tagClickFunc(this.state.selectedTags);
              this.setModalVisible(!this.state.modalVisible);
            }}>
              <Text style={{fontSize: 50, color: '#000'}}>Done</Text>
            </TouchableHighlight>
         </View>
        </Modal>
      </View>
    );
  }
}

class TagList extends Component {
  constructor(props) {
    super(props);
    this.state= {
      selectedTags: []
    }
  }

  addTag(tag) {
    this.setState({
      selectedTags: this.state.selectedTags.concat(tag)
    });
  }

  removeTag(tag) {
    this.setState({
      selectedTags: this.state.selectedTags.splice(this.state.selectedTags.indexOf(tag), 1)
    });
  }

  getTags() {
    return this.state.selectedTags;
  }

  render() {
    return (
      <Container style={{flex: 1, justifyContent: 'center'}}>
        <Content>
          {this.props.tags.map(tag => <OneTag tagName={tag}
                                              addOneTag={this.props.addOneTag}
                                              getTagsFromTagList={this.getTags.bind(this)} 
                                              setTagsInModalView={this.props.setTagsInModalView} 
                                              addToTagList={this.addTag.bind(this)} 
                                              removeFromTagList={this.removeTag.bind(this)} 
                                              tagClickFunc={this.props.tagClickFunc}/>)}
        </Content>
      </Container>
    );
  }
}

class OneTag extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false
    };
  }

  select(tag) {
    this.props.addOneTag(tag);
    this.setState({selected: true});
    // if (this.state.selected) {
    //   this.props.removeFromTagList(tag);
    // } else {
    //   this.props.addToTagList(tag);
    // }
    // this.props.setTagsInModalView(this.props.getTagsFromTagList());
    // this.setState({selected: !this.state.selected});
  }

  render() {
    return (
      <Button style={this.state.selected ? styles.selectedTag: styles.normalTag} onPress={ () => this.select(this.props.tagName) } bordered>
        {this.props.tagName}
      </Button>
    );
  }
}

const styles = StyleSheet.create({
  selectedTag: {
    backgroundColor: 'lightgray'
  },
  normalTag: {
    backgroundColor: '#fff'
  }
});

          // <Button bordered> Primary </Button>
          // <Button bordered success> Success </Button>
          // <Button bordered info> Info </Button>
          // <Button bordered warning> Warning </Button>
          // <Button bordered danger> Danger </Button>


// <TouchableHighlight onPress={() => {
//           this.setModalVisible(true)
//         }}>
//           <Text>Show Modal</Text>
//         </TouchableHighlight>