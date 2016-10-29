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
        <Header>
          <Title>TagMe</Title>
        </Header>
        <View style={styles.container}>
          {
            this.state.fontLoaded ? (
            <View>
              <Button
                primary
                style={styles.button}
                onPress={() => this._navigate('Memories')}>
                <Text style={styles.buttonText}>
                  View All   <Ionicons name="ios-images-outline" size={25} color="white" />
                </Text>
              </Button>

              <Button
                primary
                style={styles.button}
                onPress={this.getImage.bind(this)}>
                <Text style={styles.buttonText}>
                  Upload Photo   <Ionicons name="ios-cloud-upload-outline" size={25} color="white" />
                </Text>
              </Button>

              <Button
                primary
                style={styles.button}
                onPress={this.takeImage.bind(this)}>
                <Text style={styles.buttonText}>
                  Take Photo   <Ionicons name="ios-camera-outline" size={25} color="white" />
                </Text>
              </Button>

              <Button
                primary
                style={styles.button}
                onPress={this.logout.bind(this)}>
                <Text style={styles.buttonText}>
                  Logout   <Ionicons name="ios-log-out" size={25} color="white" />
                </Text>
              </Button>
            </View>
            ) : null
          }
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    ...Font.style('montserrat'),
    color: '#fff',
    fontSize: 20
  },
  button: {
    padding: 10,
    overflow: 'hidden',
    borderRadius: 4,
    margin: 20,
    backgroundColor: '#f6755e',
    height: 45
  }
});
