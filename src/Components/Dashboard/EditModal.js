import React, {Component} from 'react';
import {
  Modal,
  Text,
  TouchableHighlight,
  View,
  ToastAndroid,
} from 'react-native';
import {Button, Item, Input} from 'native-base';
import {ConfirmDialog} from 'react-native-simple-dialogs';
import {UserContext} from '../../UserProvider';

import auth from '@react-native-firebase/auth';

const EditModal = props => {
  const {user, setUser} = React.useContext(UserContext);
  const [username, setUsername] = React.useState('');

  React.useEffect(() => {
    setUsername(props.user.username);
  }, [props]);

  const handleChange = value => {
    setUsername(value);
  };
  return (
    <ConfirmDialog
      visible={props.visible}
      title="Edit Username"
      onTouchOutside={props.setModalVisible}
      positiveButton={{
        title: 'Submit',
        onPress: () =>
          auth()
            .currentUser.updateProfile({displayName: username})
            .then(_ => {
              setUser({...user, username});
              props.setModalVisible();
              ToastAndroid.show(
                `Success edit username ${username}`,
                ToastAndroid.SHORT,
              );
            })
            .catch(_ => {
              ToastAndroid.show(
                `Failed edit username ${username}`,
                ToastAndroid.SHORT,
              );
            }),
      }}
      negativeButton={{
        title: 'Cancel',
        onPress: props.setModalVisible,
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
  );
};

export default EditModal;
