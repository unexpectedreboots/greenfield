import Exponent from 'exponent';
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
import { Font } from 'exponent';
import { Container, Header, Title, Content, Footer, Button } from 'native-base';
import { Ionicons } from '@exponent/vector-icons';

var STORAGE_KEY = 'id_token';

export default class Homescreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false
    }
  }

  async componentDidMount() {
    await Font.loadAsync({
      'pacifico': require('./assets/fonts/Pacifico.ttf'),
      'montserrat': require('./assets/fonts/Montserrat-Regular.ttf')
    });
    this.setState({ fontLoaded: true });
  }

  async _userLogout() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      AlertIOS.alert("Logout Success!")
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
  }

  _navigate(sceneName, imageUri) {
    console.log('changing scenes!');
    this.props.navigator.push({
      name: sceneName,
      passProps: {
        'image': {uri: imageUri},
        'username': this.props.username,
        'prevScene': 'Homescreen'
      }
    });
  }

  logout() {
    console.log('logout called');
    this._userLogout()
    .then(()=> {
      this.props.navigator.pop();
    })
    .catch((err)=> {
      console.log('error logging out', err);
    });
  }

  getImage() {
    var oneImage = async function(){
      return Exponent.ImagePicker.launchImageLibraryAsync({});
    };
    oneImage().then((image)=> {
      if (!image.cancelled) {
        this._navigate('Memory', image.uri);
      }
    });
  }

  takeImage() {
    // Cannot be run on simulator as it does not have access to a camera
    var newImage = async function() {
      return Exponent.ImagePicker.launchCameraAsync({});
    };
    newImage().then((image) => {
      if (!image.cancelled) {
        this._navigate('Memory', image.uri);
      }
    });
  }

  render() {
    return (
      <Container>
        <Header style={{height: 80}}>
          <Button transparent><Ionicons name="ios-home" size={35} color="#444" /></Button>
          <Title style={styles.headerText}>TagMe</Title>
          <Button transparent onPress={this.logout.bind(this)}><Ionicons name="ios-log-out" size={35} color="#444" /></Button>
        </Header>
        <Content contentContainerStyle={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          {
            this.state.fontLoaded ? (
            <View style={{alignItems: 'center'}}>
              <View style={{flexDirection: 'row'}}>
                <Button
                  primary
                  style={styles.takePhotoButton}
                  onPress={this.takeImage.bind(this)}>
                  <View style={{flexDirection: 'column', alignItems: 'center'}}>
                  <Text style={styles.takePhotoButtonText}>Take Photo</Text>
                  <Ionicons name="ios-camera-outline" size={40} color="white" />
                  </View>
                </Button>
              </View>

              <View style={{flexDirection: 'row', marginTop: 100}}>
                <Button
                  primary
                  style={styles.button}
                  onPress={() => this._navigate('Memories')}>
                  <Text style={styles.buttonText}>
                    View All    <Ionicons name="ios-images-outline" size={30} color="white" />
                  </Text>
                </Button>

                <Button
                  primary
                  style={styles.button}
                  onPress={this.getImage.bind(this)}>
                  <Text style={styles.buttonText}>
                    Upload    <Ionicons name="ios-cloud-upload-outline" size={30} color="white" />
                  </Text>
                </Button>
              </View>
            </View>
            ) : null
          }
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  headerText: {
    ...Font.style('pacifico'),
    fontSize: 30,
    color: '#444',
    paddingTop: 25
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    padding: 10,
    overflow: 'hidden',
    borderRadius: 4,
    backgroundColor: '#f6755e',
    margin: 5,
    height: 80,
    width: 180
  },
  buttonText: {
    ...Font.style('montserrat'),
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 22
  },
  takePhotoButton: {
    padding: 10,
    height: 220,
    width: 220,
    borderRadius: 110,
    backgroundColor: '#25a2c3',
  },
  takePhotoButtonText: {
    ...Font.style('montserrat'),
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 27,
    paddingTop: 20
  }
});
