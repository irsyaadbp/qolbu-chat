import React from 'react';
import {
  Text,
  ScrollView,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  FlatList,
  RefreshControl,
  Dimensions,
} from 'react-native';
import {UserContext} from '../../../UserProvider';
import database from '@react-native-firebase/database';

const height = Dimensions.get('window').height;

const ChatScreen = props => {
  const {user} = React.useContext(UserContext);
  const [loading, setLoading] = React.useState(true);

  const [friendsList, setFriendsList] = React.useState([]);

  const [refreshing, setRefreshing] = React.useState(false);

  React.useEffect(() => {
    const timeOut = setTimeout(() => {
      getAllUserCallback();
    }, 0);

    return () => {
      clearTimeout(timeOut);
    };
  }, [getAllUserCallback]);

  const getAllUser = async () => {
    const refMessage = database().ref(`/messages/${user.uid}`);
    // Fetch the data snapshot
    const snapMessage = await refMessage.once('value');
    console.log(snapMessage.val(), 'aye');

    if (snapMessage.val() !== null) {
      const friendsChatId = Object.keys(snapMessage.val());

      const refUser = database().ref(`users`);
      // Fetch the data snapshot
      const snapUser = await refUser.once('value');

      const allFriends = snapUser.val();

      const allChatFriends = friendsChatId.map(uid => allFriends[uid]);

      setFriendsList(allChatFriends);
    } else {
      setFriendsList([]);
    }
    setLoading(false);
    setRefreshing(false);
  };

  const getAllUserCallback = React.useCallback(getAllUser, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setLoading(true);

    getAllUserCallback();
  }, [getAllUserCallback]);

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        // onPress={() =>
        //   this.props.screenProps.content.navigate('SetFriend', {item})
        // }
        onPress={() =>
          props.screenProps.router.navigate('Personal', {friend: item})
        }>
        {console.log(item, 'user renderitem')}
        <View style={styles.row}>
          <Image source={{uri: item.photo}} style={styles.pic} />
          <View>
            <View style={styles.nameContainer}>
              <Text
                style={styles.nameTxt}
                numberOfLines={1}
                ellipsizeMode="tail">
                {item.username}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      {console.log(friendsList.length, 'Navigation')}
      {/* <Text>{friendsList.username}</Text> */}
      {loading ? (
        <Text>Loading...</Text>
      ) : friendsList.length !== 0 ? (
        <FlatList
          data={friendsList}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#FB5286', '#FB5286']}
            />
          }
        />
      ) : (
        // <ScrollView>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#FB5286', '#FB5286']}
            />
          }>
          <Text>No Data</Text>
        </ScrollView>
        // </ScrollView>
      )}

      {/* <Button
        onPress={() => props.screenProps.router.navigate('Personal')}
        title="Pindah"
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    // flex: 1,
    // backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
    height: height,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#FB5286',
    backgroundColor: '#fff',
    // borderBottomWidth: 1,
    padding: 10,
  },
  pic: {
    borderRadius: 30,
    width: 60,
    height: 60,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 280,
  },
  nameTxt: {
    marginLeft: 15,
    fontWeight: '600',
    color: '#222',
    fontSize: 18,
    width: 170,
  },
  status: {
    fontWeight: '200',
    color: '#ccc',
    fontSize: 13,
  },
  on: {
    fontWeight: '200',
    color: 'green',
    fontSize: 13,
  },
  off: {
    fontWeight: '200',
    color: 'red',
    fontSize: 13,
  },
  msgContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  email: {
    fontWeight: '400',
    color: '#008B8B',
    fontSize: 12,
    marginLeft: 15,
  },
});

export default ChatScreen;
