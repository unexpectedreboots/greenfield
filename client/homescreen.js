import Exponent from 'exponent';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  AlertIOS,
  AsyncStorage
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
    this.props.navigator.push({
      name: sceneName,
      passProps: {
        'image': {uri: imageUri},
        'username': this.props.username,
        'prevScene': 'Homescreen'
      }
    });
  }

  _navigateLogout() {
    this.props.navigator.push({
      name: 'Login'
    })
  }

  logout() {
    this._userLogout()
    .then(()=> {
      this._navigateLogout();
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
        <View style={styles.backgroundImageWrapper}>
          <Image source={require('./assets/images/city.jpg')} style={styles.backgroundImage} />
        </View>
        <Header style={{height: 80, zIndex: 1}}>
          <Button transparent><Text style={styles.buttonText}> </Text></Button>
          <Title style={styles.headerText}>TagMe</Title>
          <Button transparent onPress={this.logout.bind(this)}>
            <Ionicons name="ios-log-out" size={35} color="#444" />
          </Button>
        </Header>
        <View style={styles.container}>
          {
            this.state.fontLoaded ? (
            <View style={styles.centered}>
              <View style={styles.flexRow}>
                <Button primary style={styles.takePhotoButton} onPress={this.takeImage.bind(this)}>
                  <View style={[styles.centered, styles.flexCol]}>
                    <Text style={[styles.buttonText, styles.takePhotoButtonText]}>Take Photo</Text>
                    <Ionicons name="ios-camera-outline" size={40} color="white" />
                  </View>
                </Button>
              </View>

              <View style={[styles.flexRow, {marginTop: 100}]}>
                <Button primary style={styles.choiceButton} onPress={() => this._navigate('Memories')}>
                  <Text style={[styles.buttonText, styles.choiceButtonText]}>
                    View All    <Ionicons name="ios-images-outline" size={30} color="white" />
                  </Text>
                </Button>

                <Button primary style={styles.choiceButton} onPress={this.getImage.bind(this)}>
                  <Text style={[styles.buttonText, styles.choiceButtonText]}>
                    Upload    <Ionicons name="ios-cloud-upload-outline" size={30} color="white" />
                  </Text>
                </Button>
              </View>
            </View>
            ) : null
          }
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  backgroundImageWrapper: {
    position: 'absolute',
    top: 0,
    zIndex: 0,
    alignItems: 'center'
  },

  backgroundImage: {
    flex: 1,
    resizeMode: 'stretch'
  },

  headerText: {
    ...Font.style('pacifico'),
    fontSize: 30,
    color: '#444',
    paddingTop: 35
  },

  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },

  centered: {
    alignItems: 'center'
  },

  flexRow: {
    flexDirection: 'row'
  },

  flexCol: {
    flexDirection: 'column'
  },

  choiceButton: {
    height: 80,
    width: 170,
    borderRadius: 4,
    backgroundColor: '#f6755e',
    margin: 5
  },

  takePhotoButton: {
    height: 220,
    width: 220,
    borderRadius: 110,
    backgroundColor: '#25a2c3',
  },

  buttonText: {
    ...Font.style('montserrat'),
    fontWeight: 'bold',
    color: '#fff'
  },

  choiceButtonText: {
    fontSize: 22
  },

  takePhotoButtonText: {
    fontSize: 27,
    paddingTop: 20
  }
});
