import React from 'react';
import {Text, View, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {Button, Item, Input} from 'native-base';
import useBackButton from '../../../Helper/useBackButton';
import Icon from 'react-native-vector-icons/Ionicons';

const onBackPressed = navigation => navigation.goBack();

const ProfileFriendScreen = props => {
  useBackButton(() => onBackPressed(props.navigation));

  return (
    <>
      <View>
        <View style={{height: 270}}>
          <Image
            source={{
              uri: props.navigation.getParam('item').photo,
            }}
            style={{height: 270}}
          />
        </View>
        <View style={{paddingHorizontal: 24, paddingVertical: 48}}>
          <View>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#C8C8C8',
                }}>
                Username{' '}
              </Text>
            </View>
            <Text style={{fontWeight: 'bold', fontSize: 16, marginTop: 8}}>
              {props.navigation.getParam('item').username}
            </Text>
          </View>
          <View style={{marginVertical: 24}}>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#C8C8C8',
                }}>
                Phone Number
              </Text>
            </View>

            <Text style={{fontWeight: 'bold', fontSize: 16, marginTop: 8}}>
              {props.navigation.getParam('item').phone}
            </Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={{
          width: 55,
          height: 55,
          borderRadius: 100,
          position: 'absolute',
          backgroundColor: '#FB5286',
          right: '5%',
          top: '31%',
        }}
        onPress={() =>
          props.navigation.navigate('Personal', {
            friend: props.navigation.getParam('item'),
          })
        }>
        <View
          style={{
            width: 55,
            height: 55,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icon name={'md-chatbubbles'} size={32} color={'#fff'} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          width: 55,
          height: 55,
          borderRadius: 100,
          position: 'absolute',
          backgroundColor: '#FB5286',
          right: '25%',
          top: '31%',
        }}>
        <View
          style={{
            width: 55,
            height: 55,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icon name={'md-locate'} size={32} color={'#fff'} />
        </View>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileFriendScreen;
