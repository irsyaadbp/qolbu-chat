import React from 'react';
import {Alert, StatusBar} from 'react-native';
import {Header, Body, Right, Button, Icon, Title} from 'native-base';
import auth from '@react-native-firebase/auth';
import {UserContext} from '../../UserProvider';
import database from '@react-native-firebase/database';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-community/async-storage';

const HeaderComponent = props => {
  const {user, setUser} = React.useContext(UserContext);
  const logout = () => {
    Alert.alert('Logout', 'Are you sure to logout?', [
      {
        text: 'Cancel',
        onPress: () => {},
      },
      {
        text: 'Yes',
        onPress: async () => {
          try {
            await getCurrentPosition();
            await auth().signOut();
            await AsyncStorage.removeItem('@user');
            props.navigation.navigate('Auth');
            await setUser(null);
          } catch (e) {
            console.log(e, 'error logout');
          }
        },
      },
    ]);
  };

  const getCurrentPosition = () => {
    Geolocation.getCurrentPosition(
      position => {
        const ref = database().ref(`/users/${user.uid}`);

        console.log(position.coords, 'koordinat');

        ref.update({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          online: false,
        });
      },
      err => console.log(err),
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 8000,
        distanceFilter: 50,
        forceRequestLocation: true,
      },
    );
  };

  return (
    <Header style={{backgroundColor: '#FB5286'}}>
      <StatusBar barStyle="light-content" backgroundColor="#FB5286" />
      <Body>
        <Title style={{fontWeight: 'bold', marginLeft: 8}}>Qolbu</Title>
      </Body>
      <Right>
        <Button
          transparent
          onPress={() => props.navigation.navigate('Profile')}>
          <Icon name="person" />
        </Button>
        <Button transparent onPress={logout}>
          <Icon name="md-log-out" />
        </Button>
      </Right>
    </Header>
  );
};

export default HeaderComponent;
