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

export default class CaptionView extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      modalVisible: false,
      caption: ''
    };
  }

}

