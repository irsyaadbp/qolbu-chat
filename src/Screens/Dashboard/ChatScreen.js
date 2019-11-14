import React from 'react';
import {Text, TextInput, Button} from 'react-native';
import auth from '@react-native-firebase/auth';
import {UserContext} from '../../UserProvider';

const ChatScreen = props => {
  const {user} = React.useContext(UserContext);

  return (
    <>
      <Text>{user.phone}</Text>
      {console.log(user, 'context user')}
      {/* <Button onPress={logout} title="Logout" /> */}
    </>
  );
};

export default ChatScreen;
