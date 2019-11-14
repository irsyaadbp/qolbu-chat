import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Button, Item, Input} from 'native-base';
import EditModal from '../../Components/Dashboard/EditModal';

const DetailProfile = props => {
  // const updateUser
  const [modalVisible, setModalVisible] = React.useState(false);
  return (
    <View
      style={{
        width: '100%',
      }}>
      {console.log(props.user, 'user')}
      <View>
        <EditModal
          visible={modalVisible}
          setModalVisible={() => setModalVisible(!modalVisible)}
          user={props.user}
        />
        <View style={{flexDirection: 'row'}}>
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
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#FB5286',
                marginLeft: 8,
              }}>
              edit
            </Text>
          </TouchableOpacity>
        </View>
        <Item>
          <Input
            value={props.user.username}
            style={{fontWeight: 'bold'}}
            disabled
          />
        </Item>
      </View>
      <View style={{marginVertical: 24}}>
        <View style={{flexDirection: 'row'}}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: '#C8C8C8',
            }}>
            Phone Number{' '}
          </Text>
        </View>

        <Item>
          <Input
            value={props.user.phone}
            style={{fontWeight: 'bold'}}
            disabled
          />
        </Item>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileImg: {
    height: 150,
    width: 150,
    borderRadius: 150,
  },
});

export default DetailProfile;
