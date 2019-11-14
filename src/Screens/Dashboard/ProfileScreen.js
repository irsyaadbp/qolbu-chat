import React from 'react';
import {Text, View, StatusBar, ScrollView} from 'react-native';
import {Header, Left, Body, Button, Icon, Title} from 'native-base';

import Avatar from '../../Components/Dashboard/Avatar';
import DetailProfile from '../../Components/Dashboard/DetailProfile';

import {UserContext} from '../../UserProvider';

import useBackButton from '../../Helper/useBackButton';

const onBackPressed = navigation => navigation.goBack();
const ProfileScreen = props => {
  const {user} = React.useContext(UserContext);
  useBackButton(() => onBackPressed(props.navigation));
  return (
    <>
      <View
        style={{
          height: 60,
          padding: 16,
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <StatusBar backgroundColor="#fff" barStyle={'dark-content'} />
        <Icon
          name="md-arrow-back"
          onPress={() => onBackPressed(props.navigation)}
        />
      </View>
      <ScrollView style={{paddingHorizontal: 24}}>
        <Text style={{fontSize: 32, fontWeight: 'bold'}}>Profile</Text>
        <Avatar />
        <DetailProfile user={user} navigation={props.navigation} />
      </ScrollView>
    </>
  );
};

export default ProfileScreen;
