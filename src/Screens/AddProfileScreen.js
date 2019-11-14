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
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {UserContext} from '../UserProvider';
import {Button, Item, Input} from 'native-base';
import database from '@react-native-firebase/database';
import ImagePicker from 'react-native-image-picker';
import {TouchableOpacity} from 'react-native-gesture-handler';

// import EditModal from '../../Components/Dashboard/EditModal';

const AddProfileScreen = props => {
  let options = {
    title: 'Select Image',
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  const {user, setUser} = React.useContext(UserContext);
  const [modalVisible, setModalVisible] = React.useState(false);

  // const [dataProfile, setDataProfile] = React.useState({
  //   username: '',
  //   photo: '',
  // });

  // React.useEffect(() => {
  //   setDataProfile({...dataProfile, username: user.username});
  // }, [user]);

  const addProfil = () => {
    auth()
      .currentUser.updateProfile({displayName: user.username})
      .then(_ => {
        // setUser({...user, username: user.username});
        props.navigation.navigate('Dashboard');
        // ToastAndroid.show(
        //   `Success edit username ${user.username}`,
        //   ToastAndroid.SHORT,
        // );
      })
      .catch(err => {
        Alert.alert(JSON.stringify(err));
        ToastAndroid.show(
          `Failed edit username ${user.username}`,
          ToastAndroid.SHORT,
        );
      });
  };

  const imagePicker = () => {
    // // Launch Camera:
    // ImagePicker.launchCamera(options, response => {
    //   // Same code as in above section!
    // });

    // Open Image Library:
    // ImagePicker.launchImageLibrary(options, response => {
    //   // Same code as in above section!
    // });
    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        // const source = {uri: response.uri};

        // You can also display the image using data:
        const source = {uri: 'data:image/jpeg;base64,' + response.data};
        console.log(source, 'source');

        setUser({...user, photo: source});

        // this.setState({
        //   filePath: response,
        //   fileData: response.data,
        //   fileUri: response.uri,
        // });
      }
    });
  };

  return (
    <ScrollView style={{padding: 24}}>
      {/* {console.log(user, 'user', dataProfile)} */}
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <Text style={{fontSize: 28, fontWeight: 'bold', textAlign: 'center'}}>
        Add Profile
      </Text>
      <View
        style={{
          // backgroundColor: 'red',
          width: '100%',
          height: 250,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {console.log(user.photo, 'sourcce photo')}
        <TouchableOpacity onPress={imagePicker}>
          <Image
            source={
              user.photo
                ? user.photo
                : {
                    uri:
                      'https://akcdn.detik.net.id/community/media/visual/2018/10/19/b5f8bbb6-8bac-4a31-95a2-efb5a4c917d6.jpeg?w=770&q=90',
                  }
            }
            style={styles.profileImg}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          width: '100%',
          marginBottom: 32,
        }}>
        {/* {console.log(user, 'user')} */}
        <View>
          {/* <EditModal
          visible={modalVisible}
          setModalVisible={() => setModalVisible(!modalVisible)}
          user={props.user}
        /> */}
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
              value={user.username}
              style={{fontWeight: 'bold'}}
              onChangeText={value => setUser({...user, username: value})}
            />
          </Item>
        </View>
      </View>
      <Button
        block
        onPress={addProfil}
        style={{
          backgroundColor: '#FB5286',
        }}>
        <Text style={{color: 'white'}}>Save</Text>
      </Button>
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
