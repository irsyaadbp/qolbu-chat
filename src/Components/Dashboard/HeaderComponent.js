import React from 'react';
import {Alert, StatusBar} from 'react-native';
import {Header, Body, Right, Button, Icon, Title} from 'native-base';
import auth from '@react-native-firebase/auth';
import {UserContext} from '../../UserProvider';

const HeaderComponent = props => {
  const {setUser} = React.useContext(UserContext);
  const logout = () => {
    Alert.alert('Logout', 'Are you sure to logout?', [
      {
        text: 'Cancel',
        onPress: () => {},
      },
      {
        text: 'Yes',
        onPress: async () => {
          try {
            await auth().signOut();
            props.navigation.navigate('Auth');
            await setUser(null);
          } catch (e) {
            console.log(e, 'error logout');
          }
        },
      },
    ]);
  };

  return (
    <Header style={{backgroundColor: '#FB5286'}}>
      <StatusBar barStyle="light-content" backgroundColor="#FB5286" />
      <Body>
        <Title style={{fontWeight: 'bold', marginLeft: 8}}>Qolbu</Title>
      </Body>
      <Right>
        <Button
          transparent
          onPress={() => props.navigation.navigate('Profile')}>
          <Icon name="person" />
        </Button>
        <Button transparent onPress={logout}>
          <Icon name="md-log-out" />
        </Button>
      </Right>
    </Header>
  );
};

export default HeaderComponent;
