import React from 'react';
import {
  Text,
  View,
  TextInput,
  ImageBackground,
  Dimensions,
  StatusBar,
  StyleSheet,
} from 'react-native';
import Greetings from '../../Components/Auth/Greetings';
import ValidatePhone from '../../Components/Auth/ValidatePhone';

const Authentication = props => {
  const [visible, setVisible] = React.useState({
    greeting: true,
    phone: false,
  });

  return (
    <View
      style={{
        backgroundColor: 'white',
        height: '100%',
        justifyContent: 'center',
      }}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <Greetings
        onBeginChat={() =>
          setVisible({
            ...visible,
            greeting: false,
            phone: true,
          })
        }
        visible={visible.greeting}
      />
      <ValidatePhone visible={visible.phone} navigation={props.navigation} />
    </View>
  );
};

export default Authentication;
