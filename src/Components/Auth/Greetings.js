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
import {Button, Input, Item} from 'native-base';
const {height, width} = Dimensions.get('window');

const Greetings = props => {
  return (
    <View>
      {props.visible ? (
        <>
          <ImageBackground
            source={require('../../../assets/begin-chat.png')}
            style={{width: '100%', height: height / 3}}
          />
          <View style={{paddingHorizontal: 24, marginVertical: 24}}>
            <Text style={{fontSize: 24, textAlign: 'center'}}>Welcome,</Text>
            <Text style={{fontSize: 16, textAlign: 'center'}}>
              Let's say hi to others
            </Text>

            <Button
              block
              style={{backgroundColor: '#FB5286', marginTop: 40}}
              onPress={props.onBeginChat}>
              <Text style={{color: 'white'}}>Start chat</Text>
            </Button>
          </View>
        </>
      ) : null}
    </View>
  );
};

export default Greetings;
