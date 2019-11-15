import React from 'react';
import {
  View,
  Text,
  Image,
  ToastAndroid,
  Platform,
  PermissionsAndroid,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';

import database from '@react-native-firebase/database';
import Geolocation from 'react-native-geolocation-service';
import {UserContext} from '../../UserProvider';

const {width, height} = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const MapsScreen = props => {
  const {user} = React.useContext(UserContext);
  const [loading, setLoading] = React.useState(false);
  const [mapRegion, setMapRegion] = React.useState({
    latitude: Number(user.latitude),
    longitude: Number(user.longtitude),
    latitudeDelta: 0.00922,
    longitudeDelta: 0.00421 * 1.5,
  });

  const [friendsList, setFriendsList] = React.useState([]);

  React.useEffect(() => {
    console.log(user, 'ini latitude');
    setMapRegion({
      latitude: Number(user.latitude),
      longitude: Number(user.longitude),
      latitudeDelta: 0.00922,
      longitudeDelta: 0.00421 * 1.5,
    });
  }, [user]);

  const getLocation = () => {
    // const hasLocationPermission = await this.hasLocationPermission();

    // if (!hasLocationPermission) {
    //   return;
    // }

    // this.setState({loading: true}, () => {
    Geolocation.getCurrentPosition(
      position => {
        setMapRegion({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.00922,
          longitudeDelta: 0.00421 * 1.5,
        });

        // this.setState({
        //   mapRegion: region,
        //   latitude: position.coords.latitude,
        //   longitude: position.coords.longitude,
        //   loading: false,
        // });
        // console.warn(position);
      },
      error => {
        // this.setState({errorMessage: error});
        console.warn(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 50,
        forceRequestLocation: true,
      },
    );
    // });
  };

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

  return (
    <>
      <View style={[styles.container]}>
        {/* {console.log(mapRegion, 'mapregion', user)} */}
        <MapView
          style={{width: '100%', height: '100%'}}
          showsMyLocationButton={true}
          showsIndoorLevelPicker={true}
          showsUserLocation={true}
          zoomControlEnabled={true}
          showsCompass={true}
          showsTraffic={true}
          region={mapRegion}
          initialRegion={{
            latitude: -7.755322,
            longitude: 110.381174,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}>
          {console.log(friendsList, 'map')}
          {friendsList.map((item, index) => {
            // console.warn(item);
            return (
              <Marker
                key={index}
                title={item.username}
                description={item.online ? 'online' : 'offline'}
                draggable
                coordinate={{
                  latitude: item.latitude || 0,
                  longitude: item.longitude || 0,
                }}
                onCalloutPress={() => {
                  props.screenProps.router.navigate('ProfileFriend', {item});
                }}>
                <View>
                  {console.log(item.photo)}
                  <Image
                    source={{uri: item.photo}}
                    style={{width: 40, height: 40, borderRadius: 50}}
                  />
                  <Text>{item.name}</Text>
                </View>
              </Marker>
            );
          })}
        </MapView>
        {/* <View style={styles.menuBottom}>
          <TouchableOpacity>
            <Text style={styles.buttonText} onPress={() => getLocation()}>
              Get Current Location
            </Text>
          </TouchableOpacity>
        </View> */}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  // input: {
  //   paddingVertical: 10,
  //   paddingHorizontal: 20,
  //   borderWidth: 1,
  //   borderColor: '#ccc',
  //   backgroundColor: '#ddd6f3',
  //   width: '70%',
  //   borderRadius: 10,
  //   marginBottom: 15,
  // },
  // icon: {
  //   width: 200,
  //   height: 200,
  //   marginBottom: 10,
  // // },
  // title: {
  //   fontSize: 30,
  //   textAlign: 'center',
  //   marginTop: 22,
  //   color: '#5F6D7A',
  // },
  // description: {
  //   marginTop: 10,
  //   textAlign: 'center',
  //   color: '#A9A9A9',
  //   fontSize: 16,
  //   margin: 40,
  // },
  // options: {
  //   flexDirection: 'column',
  //   justifyContent: 'flex-end',
  //   alignItems: 'center',
  //   width: '100%',
  // },
  // buttonContainer: {
  //   height: 35,
  //   flexDirection: 'row',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   marginBottom: 20,
  //   width: 160,
  //   borderRadius: 20,
  // },
  // authButton: {
  //   backgroundColor: '#6441A5',
  // },
  // loginButton: {
  //   backgroundColor: '#480048',
  //   height: 40,
  //   fontSize: 20,
  //   marginVertical: 15,
  // },
  // registerButton: {
  //   backgroundColor: '#44a08d',
  //   height: 40,
  //   fontSize: 20,
  //   marginVertical: 15,
  // },
  // buttonText: {
  //   color: '#FFFFFF',
  //   fontSize: 18,
  // },
  // bottomText: {
  //   fontSize: 16,
  //   color: '#ccc',
  // },
  // center: {
  //   flexDirection: 'row',
  //   justifyContent: 'flex-start',
  //   alignItems: 'center',
  // },
  // bottomTextLink: {
  //   color: '#fff',
  //   fontWeight: 'bold',
  // },
  // menuBottom: {
  //   flex: 1,
  //   flexDirection: 'row',
  //   justifyContent: 'space-around',
  //   alignItems: 'center',
  //   // margin: 5,
  //   borderRadius: 10,
  //   width: '100%',
  //   backgroundColor: '#f48023',
  // },
});

export default MapsScreen;
