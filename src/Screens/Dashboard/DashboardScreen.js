import React from 'react';
import TabRouter from '../../Routes/TabRouter';
import Geolocation from 'react-native-geolocation-service';
import HeaderComponent from '../../Components/Dashboard/HeaderComponent';
import {UserContext} from '../../UserProvider';
import database from '@react-native-firebase/database';
import {useGeolocation} from '../../Helper/getGeolocation';

const DashboardScreen = props => {
  const {user, setUser} = React.useContext(UserContext);
  // const {latitude, langitude, error} = useGeolocation();

  React.useEffect(() => {
    getCurrentPositionCallback();
  }, [getCurrentPositionCallback]);

  const getCurrentPosition = () => {
    Geolocation.getCurrentPosition(
      position => {
        const ref = database().ref(`/users/${user.uid}`);

        console.log(position.coords, 'koordinat');

        ref.update({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setUser({
          ...user,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      err => console.log(err),
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 8000,
        distanceFilter: 50,
        forceRequestLocation: true,
      },
    );
  };

  const getCurrentPositionCallback = React.useCallback(getCurrentPosition, []);

  return (
    <>
      <HeaderComponent navigation={props.navigation} />
      <TabRouter screenProps={{router: props.navigation}} />
      {/* {console.log(latitude, 'hoi', langitude, 'er', error)} */}
    </>
  );
};

export default DashboardScreen;
