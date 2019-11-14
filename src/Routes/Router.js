import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import Splashscreen from '../Screens/Splashscreen/Splashscreen';

import Authentication from '../Screens/Auth/Authentication';

import ProfileScreen from '../Screens/Dashboard/ProfileScreen';
import AddProfileScreen from '../Screens/AddProfileScreen';

import DashboardScreen from '../Screens/Dashboard/DashboardScreen';
import TabRouter from './TabRouter';

// const SplashRouter = createStackNavigator(
//   {
//     Splashscreen,
//   },
//   {
//     headerMode: 'none',
//     initialRouteName: 'Splashscreen',
//   },
// );

const AuthRouter = createStackNavigator(
  {
    Auth: {screen: Authentication},
  },
  {
    headerMode: 'none',
    initialRouteName: 'Auth',
  },
);

const MainRouter = createStackNavigator(
  {
    Dashboard: {screen: DashboardScreen},
    // Dashboard: {screen: TabRouter},
    Profile: {screen: ProfileScreen},
  },
  {
    headerMode: 'none',
    initialRouteName: 'Dashboard',
  },
);

const Router = createSwitchNavigator(
  {
    Splashscreen,
    AuthRouter,
    MainRouter,
    AddProfileScreen,
  },
  {
    headerMode: 'none',
    initialRouteName: 'Splashscreen',
  },
);

export default createAppContainer(Router);
