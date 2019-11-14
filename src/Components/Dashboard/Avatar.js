import React from 'react';
import {Image, View, TouchableHighlight, StyleSheet} from 'react-native';

const Avatar = props => {
  return (
    <View
      style={{
        // backgroundColor: 'red',
        width: '100%',
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Image
        source={{
          uri:
            'https://akcdn.detik.net.id/community/media/visual/2018/10/19/b5f8bbb6-8bac-4a31-95a2-efb5a4c917d6.jpeg?w=770&q=90',
        }}
        style={styles.profileImg}
      />
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

export default Avatar;
