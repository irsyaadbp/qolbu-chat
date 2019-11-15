import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  FlatList,
} from 'react-native';
import database from '@react-native-firebase/database';
import {UserContext} from '../../../UserProvider';

const FriendsScreen = props => {
  const {user} = React.useContext(UserContext);
  const [loading, setLoading] = React.useState(true);
  const [friendsList, setFriendsList] = React.useState([]);

  React.useEffect(() => {
    const timeOut = setTimeout(() => {
      getAllUserCallback();
    }, 0);

    return () => {
      clearTimeout(timeOut);
    };
  }, [getAllUserCallback]);

  const getAllUser = async () => {
    database()
      .ref('users')
      .on('value', result => {
        let data = result.val();
        if (data !== null) {
          let allusers = Object.values(data);
          const filteredUser = allusers.filter(
            userFirebase => userFirebase.uid !== user.uid,
          );
          setFriendsList(filteredUser);
        } else {
          setFriendsList([]);
        }
        setLoading(false);
      });
  };

  const getAllUserCallback = React.useCallback(getAllUser, []);

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        // onPress={() =>
        //   this.props.screenProps.content.navigate('SetFriend', {item})
        // }
        onPress={() =>
          props.screenProps.router.navigate('ProfileFriend', {item})
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
              {item.online ? (
                <Text style={styles.on}>online</Text>
              ) : (
                <Text style={styles.off}>offline</Text>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      {loading ? (
        <Text>Loading...</Text>
      ) : friendsList.length === 0 ? (
        <Text>You dont have friend :(</Text>
      ) : (
        <FlatList
          data={friendsList}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
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

export default FriendsScreen;
