import React from 'react';
import {
  Image,
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ToastAndroid,
  ActivityIndicator,
  Text,
} from 'react-native';
import {UserContext} from '../../UserProvider';
import ImagePicker from 'react-native-image-picker';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-community/async-storage';

const Avatar = props => {
  const [loading, setLoading] = React.useState(false);
  const {user, setUser} = React.useContext(UserContext);
  // const [userData, setUserData] = React.useState({
  //   username: '',
  //   photo:
  //     'https://akcdn.detik.net.id/community/media/visual/2018/10/19/b5f8bbb6-8bac-4a31-95a2-efb5a4c917d6.jpeg?w=770&q=90',
  // });

  // React.useEffect(() => {
  //   setUserData({
  //     username: user.username,
  //     photo: user.photo
  //       ? user.photo
  //       : 'https://akcdn.detik.net.id/community/media/visual/2018/10/19/b5f8bbb6-8bac-4a31-95a2-efb5a4c917d6.jpeg?w=770&q=90',
  //   });
  //   // setLoading({image: false, profile: false});
  // }, [user]);

  // React.useEffect(() => {
  //   addProfil();
  // }, [addProfil, userData]);

  const options = {
    title: 'Select Image',
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  const imagePicker = () => {
    ImagePicker.showImagePicker(options, async response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        // const source = {uri: response.uri};

        // You can also display the image using data:
        setLoading(true);
        const source = {uri: 'data:image/jpeg;base64,' + response.data};
        console.log(response.uri, 'source 1');
        console.log(user, 'source 2');

        // setUserData({...user, photo: response.uri});
        await addProfil(source.uri);
        // setLoading(false);
      }
    });
  };

  const addProfil = async uri => {
    console.log(uri, 'uri');
    const data = new FormData();
    data.append('file', uri);
    data.append('upload_preset', 'eiphu4lw');

    const res = await fetch(
      'https://api.cloudinary.com/v1_1/qolbu/image/upload',
      {
        method: 'POST',
        body: data,
      },
    );

    const file = await res.json();
    console.log(file, 'iki photo');
    // // let photoUser = '';
    // // if (file.secure_url) {
    // //   photoUser = file.secure_url;
    // // } else {
    // //   photoUser = user.photo
    // //     ? user.photo
    // //     : 'https://akcdn.detik.net.id/community/media/visual/2018/10/19/b5f8bbb6-8bac-4a31-95a2-efb5a4c917d6.jpeg?w=770&q=90';
    // // }

    // // console.log(photoUser, 'ini photo user');
    auth()
      .currentUser.updateProfile({
        photoURL: file.secure_url,
      })
      .then(async _ => {
        setUser({...user, photo: file.secure_url});
        const ref = database().ref(`/users/${user.uid}`);

        try {
          const value = await AsyncStorage.getItem('@user');
          console.log(value, 'userData');
          if (value !== null) {
            try {
              ref.update({
                photo: file.secure_url,
              });

              const newDataUser = JSON.parse(value);
              newDataUser.photo = file.secure_url;

              console.log(newDataUser, 'ini new data');

              await AsyncStorage.setItem('@user', JSON.stringify(newDataUser));
              // await setUser({
              //   uid: currentUser._user.uid,
              //   username: currentUser._user.displayName,
              //   email: currentUser._user.displayName,
              //   phone: currentUser._user.phoneNumber,
              //   photo: currentUser._user.photoURL,
              // });

              // await setUser();

              ToastAndroid.show('Success edit photo', ToastAndroid.SHORT);
              setLoading(false);
            } catch (e) {
              ToastAndroid.show('Failed edit photo', ToastAndroid.SHORT);
            }
          } else {
            ToastAndroid.show('Failed edit photo', ToastAndroid.SHORT);
          }
        } catch (e) {
          // error reading value,,
          ToastAndroid.show('Failed edit photo', ToastAndroid.SHORT);
        }
        setLoading(false);
      })
      .catch(err => {
        Alert.alert(JSON.stringify(err));
        ToastAndroid.show('Failed edit photo', ToastAndroid.SHORT);
        // setLoading(false);
      });
  };

  return (
    <View
      style={{
        // backgroundColor: 'red',
        width: '100%',
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View
        style={{
          backgroundColor: '#f0f0f0',
          height: 150,
          width: 150,
          borderRadius: 150,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {/* {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : ( */}
        <TouchableOpacity onPress={imagePicker} style={styles.profileImg}>
          <Image source={{uri: user.photo}} style={styles.profileImg} />
        </TouchableOpacity>
        {/* )} */}
        {/* </View> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileImg: {
    height: 150,
    width: 150,
    borderRadius: 150,
  },
});

export default Avatar;
