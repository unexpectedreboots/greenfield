import 'react-native';
import React from 'react';
import Login from '../login';
import Homescreen from '../homescreen';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('Login renders correctly', () => {
  const tree = renderer.create(
    <Login />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('Homescreen renders correctly', () => {
  const tree = renderer.create(
    <Homescreen />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});