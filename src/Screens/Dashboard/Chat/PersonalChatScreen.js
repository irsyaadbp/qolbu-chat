import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import useBackButton from '../../../Helper/useBackButton';
import {
  GiftedChat,
  Bubble,
  InputToolbar,
  Send,
  Alert,
} from 'react-native-gifted-chat';
import database from '@react-native-firebase/database';
import {UserContext} from '../../../UserProvider';

const onBackPressed = navigation => navigation.goBack();
const PersonalChatScreen = props => {
  const {user, setUser} = React.useContext(UserContext);
  useBackButton(() => onBackPressed(props.navigation));

  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);

  React.useEffect(() => {
    const timeOut = setTimeout(() => {
      getMessageCallback();
    }, 0);

    return () => {
      clearTimeout(timeOut);
    };
  }, [getMessageCallback]);

  const getMessageList = () => {
    database()
      .ref('messages')
      .child(`${user.uid}`)
      .child(`${props.navigation.getParam('friend').uid}`)
      .on('child_added', val => {
        setMessageList(previousState =>
          GiftedChat.append(previousState, val.val()),
        );
      });
  };

  const getMessageCallback = React.useCallback(getMessageList, []);

  const onSend = () => {
    if (message.length > 0) {
      let msgId = database()
        .ref('messages')
        .child(`${user.uid}`)
        .child(`${props.navigation.getParam('friend').uid}`)
        .push().key;
      let updates = {};
      let messages = {
        _id: msgId,
        text: message,
        createdAt: database.ServerValue.TIMESTAMP,
        user: {
          _id: user.uid,
          name: user.username,
          avatar: user.photo,
        },
      };
      console.log(messages, 'message');
      updates[
        'messages/' +
          user.uid +
          '/' +
          props.navigation.getParam('friend').uid +
          '/' +
          msgId
      ] = messages;
      updates[
        'messages/' +
          props.navigation.getParam('friend').uid +
          '/' +
          user.uid +
          '/' +
          msgId
      ] = messages;

      console.log(updates, 'update');
      database()
        .ref()
        .update(updates);
      setMessage('');
    }
  };

  const renderBubble = data => {
    return (
      <Bubble
        {...data}
        wrapperStyle={{
          right: {
            backgroundColor: '#FB5286',
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: 8,
            padding: 8,
          },
          left: {
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            borderBottomRightRadius: 8,
            borderBottomLeftRadius: 0,
          },
        }}
      />
    );
  };

  const renderSend = data => {
    return (
      <Send {...data}>
        <View
          style={{
            // width: 50,
            // height: 50,
            // borderRadius: 55,
            marginBottom: 8,
            marginHorizontal: 16,
            // backgroundColor: '#FB5286',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icon name={'md-send'} size={28} color={'#FB5286'} />
        </View>
      </Send>
    );
  };

  const renderInputToolbar = data => {
    return <InputToolbar {...data} containerStyle={{padding: 4}} />;
  };

  return (
    <View style={{flex: 1}}>
      {/* {console.log(user.)} */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Icon
            name={'md-arrow-back'}
            size={24}
            color={'#fff'}
            style={{marginLeft: 8}}
          />
        </TouchableOpacity>
        <View style={styles.img}>
          <Image
            source={{
              uri: props.navigation.getParam('friend').photo,
            }}
            style={styles.photo}
          />
        </View>
        <View style={{marginLeft: 5}}>
          <Text style={styles.heading}>
            {props.navigation.getParam('friend').username}
          </Text>
          <Text style={styles.off}>
            {props.navigation.getParam('friend').online ? 'online' : 'offline'}
          </Text>
        </View>
      </View>

      <GiftedChat
        renderBubble={renderBubble}
        renderSend={renderSend}
        text={message}
        onInputTextChanged={val => {
          setMessage(val);
        }}
        messages={messageList}
        onSend={() => onSend()}
        user={{
          _id: user.uid,
        }}
        // alwaysShowSend={true}
        // loadEarlier={true}
        showUserAvatar={false}
        showAvatarForEveryMessage={false}
        // renderInputToolbar={renderInputToolbar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  photo: {
    flex: 1,
    width: '100%',
    resizeMode: 'cover',
  },
  img: {
    backgroundColor: 'silver',
    width: 41,
    height: 41,
    borderRadius: 50,
    marginLeft: 24,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  heading: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    width: 'auto',
  },
  header: {
    backgroundColor: '#FB5286',
    height: 70,
    width: '100%',
    paddingHorizontal: 12,
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  off: {
    fontWeight: '200',
    color: 'whitesmoke',
    fontSize: 13,
    // paddingLeft: 5,
  },
});
export default PersonalChatScreen;
