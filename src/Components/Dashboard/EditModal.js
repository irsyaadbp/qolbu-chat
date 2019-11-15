import React, {Component} from 'react';
import {
  Modal,
  Text,
  TouchableHighlight,
  View,
  ToastAndroid,
} from 'react-native';
import {Button, Item, Input} from 'native-base';
import {ConfirmDialog, ProgressDialog} from 'react-native-simple-dialogs';
import {UserContext} from '../../UserProvider';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-community/async-storage';
import auth from '@react-native-firebase/auth';

const EditModal = props => {
  const {user, setUser} = React.useContext(UserContext);
  const [username, setUsername] = React.useState('');

  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setUsername(props.user.username);
  }, [props]);

  const handleChange = value => {
    setUsername(value);
  };
  return (
    <View>
      <ConfirmDialog
        visible={props.visible}
        title="Edit Username"
        onTouchOutside={props.setModalVisible}
        positiveButton={{
          title: 'Submit',
          onPress: () => {
            setLoading(true);
            auth()
              .currentUser.updateProfile({displayName: username})
              .then(async _ => {
                try {
                  const value = await AsyncStorage.getItem('@user');
                  console.log(value, 'userData');
                  if (value !== null) {
                    try {
                      setUser({...user, username});
                      const ref = database().ref(`/users/${user.uid}`);

                      await ref.update({
                        username,
                      });

                      const newDataUser = JSON.parse(value);
                      newDataUser.username = username;

                      console.log(newDataUser, 'ini new data');

                      await AsyncStorage.setItem(
                        '@user',
                        JSON.stringify(newDataUser),
                      );
                      // await setUser({
                      //   uid: currentUser._user.uid,
                      //   username: currentUser._user.displayName,
                      //   email: currentUser._user.displayName,
                      //   phone: currentUser._user.phoneNumber,
                      //   photo: currentUser._user.photoURL,
                      // });

                      // await setUser();

                      props.setModalVisible();
                      ToastAndroid.show(
                        `Success edit username ${username}`,
                        ToastAndroid.SHORT,
                      );
                    } catch (e) {
                      ToastAndroid.show(
                        'Failed edit username',
                        ToastAndroid.SHORT,
                      );
                    }
                  } else {
                    ToastAndroid.show(
                      'Failed edit username',
                      ToastAndroid.SHORT,
                    );
                  }
                  setLoading(false);
                } catch (e) {
                  // error reading value,,
                  ToastAndroid.show('Failed edit username', ToastAndroid.SHORT);
                }
              })
              .catch(_ => {
                setLoading(false);
                ToastAndroid.show('Failed edit username', ToastAndroid.SHORT);
              });
          },
          titleStyle: {color: '#FB5286'},
        }}
        negativeButton={{
          title: 'Cancel',
          onPress: props.setModalVisible,
          titleStyle: {color: '#FB5286'},
        }}>
        <View>
          <Item>
            <Input
              value={username}
              style={{fontWeight: 'bold'}}
              onChangeText={handleChange}
            />
          </Item>
        </View>
      </ConfirmDialog>
      <ProgressDialog
        visible={loading}
        title="Process"
        message="Please, wait..."
      />
    </View>
  );
};

export default EditModal;
