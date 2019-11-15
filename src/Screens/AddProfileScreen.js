import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  StatusBar,
  ToastAndroid,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {UserContext} from '../UserProvider';
import {Button, Item, Input} from 'native-base';
import database from '@react-native-firebase/database';
import ImagePicker from 'react-native-image-picker';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';

const {height} = Dimensions.get('window');

const AddProfileScreen = props => {
  const options = {
    title: 'Select Image',
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  const {user, setUser} = React.useContext(UserContext);
  const [loading, setLoading] = React.useState({image: true, profile: true});
  const [userData, setUserData] = React.useState({
    username: '',
    photo:
      'https://akcdn.detik.net.id/community/media/visual/2018/10/19/b5f8bbb6-8bac-4a31-95a2-efb5a4c917d6.jpeg?w=770&q=90',
  });

  React.useEffect(() => {
    setUserData({
      username: user.username,
      photo: user.photo
        ? user.photo
        : 'https://akcdn.detik.net.id/community/media/visual/2018/10/19/b5f8bbb6-8bac-4a31-95a2-efb5a4c917d6.jpeg?w=770&q=90',
      online: true,
      phone: user.phone,
      latitude: user.latitude,
      longitude: user.longitude,
      uid: user.uid,
    });
    setLoading({image: false, profile: false});
  }, [user]);

  const imagePicker = async () => {
    await ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
        setLoading({...loading, image: false});
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        setLoading({...loading, image: false});
      } else {
        setLoading({...loading, image: true});
        // const source = response.uri;

        // You can also display the image using data:
        const source = {uri: 'data:image/jpeg;base64,' + response.data};
        console.log(source, 'source');

        setUserData({...user, photo: source.uri});
      }
      setLoading({...loading, image: false});
    });
  };

  const addProfil = async () => {
    setLoading({...loading, profile: true});
    const data = new FormData();
    data.append('file', userData.photo);
    data.append('upload_preset', 'eiphu4lw');

    const res = await fetch(
      'https://api.cloudinary.com/v1_1/qolbu/image/upload',
      {
        method: 'POST',
        body: data,
      },
    );

    const file = await res.json();

    auth()
      .currentUser.updateProfile({
        displayName: userData.username,
        photoURL: file.secure_url,
      })
      .then(async _ => {
        console.log(file.secure_url, 'url');
        try {
          await setUser({
            ...user,
            username: userData.username,
            photo: file.secure_url,
          });
          const ref = database().ref(`/users/${user.uid}`);

          await ref.set({
            username: userData.username,
            online: true,
            photo: file.secure_url,
            phone: userData.phone,
            latitude: userData.latitude,
            longitude: userData.longitude,
            uid: userData.uid,
          });

          console.log(userData, 'ini user');

          await AsyncStorage.setItem('@user', JSON.stringify(userData));

          props.navigation.navigate('Dashboard');
        } catch (e) {
          Alert.alert('Error', JSON.stringify(e));
        }
      })
      .catch(err => {
        setLoading({...loading, profile: false});
        Alert.alert(JSON.stringify(err));
        ToastAndroid.show(
          `Failed edit username ${user.username}`,
          ToastAndroid.SHORT,
        );
      });
  };

  return (
    <ScrollView style={{height: '100%'}}>
      {console.log(user, 'addprofulescreen ser')}
      {loading.profile ? (
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: height,
            backgroundColor: 'rgba(52, 52, 52, 0.4)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999,
          }}>
          <ActivityIndicator size="large" color="#fff" />
          <Text>Loading...</Text>
        </View>
      ) : null}
      <View style={{padding: 24, height: height}}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <Text style={{fontSize: 28, fontWeight: 'bold', textAlign: 'center'}}>
          Add Profile
        </Text>
        <View
          style={{
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
            {console.log(loading.image, 'lodong')}
            {loading.image ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              <TouchableOpacity onPress={imagePicker}>
                {console.log(user.photo, 'wkwkw 2')}
                <Image
                  source={{uri: userData.photo}}
                  style={styles.profileImg}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View
          style={{
            width: '100%',
            marginBottom: 32,
          }}>
          <View>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#C8C8C8',
                paddingRight: 8,
                borderRightColor: '#f0f0f0',
                borderRightWidth: 1,
              }}>
              Username{' '}
            </Text>

            <Item>
              <Input
                value={userData.username}
                style={{fontWeight: 'bold'}}
                onChangeText={value =>
                  setUserData({...userData, username: value})
                }
              />
            </Item>
          </View>
        </View>
        <TouchableOpacity
          onPress={addProfil}
          style={{
            backgroundColor: '#FB5286',
            width: '100%',
            padding: 16,
            zIndex: 1,
          }}>
          <Text style={{textAlign: 'center', color: 'white'}}>Save</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  profileImg: {
    height: 150,
    width: 150,
    borderRadius: 150,
  },
});

export default AddProfileScreen;
