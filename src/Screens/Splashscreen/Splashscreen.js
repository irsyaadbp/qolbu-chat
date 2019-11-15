import React from 'react';
import {
  View,
  Image,
  Text,
  Button,
  Platform,
  PermissionsAndroid,
  ToastAndroid,
} from 'react-native';

import {UserContext} from '../../UserProvider';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-community/async-storage';

const Splashscreen = props => {
  const hasLocationPermission = async () => {
    if (
      Platform.OS === 'ios' ||
      (Platform.OS === 'android' && Platform.Version < 23)
    ) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) {
      return true;
    }
    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }
    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location Permission Denied By User.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location Permission Revoked By User.',
        ToastAndroid.LONG,
      );
    }
    return false;
  };

  const {setUser} = React.useContext(UserContext);

  React.useEffect(() => {
    const timeOut = setTimeout(async () => {
      // await hasLocationPermission();
      const permissionLocation = await hasLocationPermission();
      if (!permissionLocation) return;
      // const currentUser = await auth().currentUser;
      // console.log(currentUser, 'user');

      // if (!currentUser) {
      //   props.navigation.navigate('Auth');
      // } else {
      //   const ref = database().ref(`/users/${currentUser._user.uid}`);
      //   const snapshot = await ref.once('value');

      // const userData = await AsyncStorage.getItem('@user');

      try {
        const value = await AsyncStorage.getItem('@user');
        console.log(value, 'userData');
        if (value !== null) {
          try {
            // await setUser({
            //   uid: currentUser._user.uid,
            //   username: currentUser._user.displayName,
            //   email: currentUser._user.displayName,
            //   phone: currentUser._user.phoneNumber,
            //   photo: currentUser._user.photoURL,
            // });

            await setUser(JSON.parse(value));

            props.navigation.navigate('Dashboard');
          } catch (e) {
            console.log(e);
          }
        } else {
          props.navigation.navigate('Auth');
        }
      } catch (e) {
        // error reading value,,
        console.log(e);
      }
      // }
    }, 1500);

    return () => {
      clearTimeout(timeOut);
    };
  }, [props, setUser]);

  return (
    <View
      style={{
        backgroundColor: '#FB5286',
        widht: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Image
        source={require('../../../assets/logo.png')}
        style={{width: 120, resizeMode: 'center', height: 120}}
      />
      <Text style={{fontSize: 28, color: 'white', fontWeight: 'bold'}}>
        Qolbu
      </Text>
      <Text style={{fontSize: 16, color: 'white'}}>Chat with heart</Text>
    </View>
  );
};

export default Splashscreen;
