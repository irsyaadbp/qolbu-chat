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
      const currentUser = await auth().currentUser;
      console.log(currentUser, 'user');
      if (!currentUser) {
        props.navigation.navigate('Auth');
      } else {
        setUser({
          uid: currentUser._user.uid,
          username: currentUser._user.displayName,
          email: currentUser._user.displayName,
          phone: currentUser._user.phoneNumber,
          photo: currentUser._user.photoUrl,
        });
        props.navigation.navigate('Dashboard');
      }
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
