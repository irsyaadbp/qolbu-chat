import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import Splashscreen from '../Screens/Splashscreen/Splashscreen';

import Authentication from '../Screens/Auth/Authentication';

import ProfileScreen from '../Screens/Dashboard/ProfileScreen';
import AddProfileScreen from '../Screens/AddProfileScreen';

import DashboardScreen from '../Screens/Dashboard/DashboardScreen';
import PersonalChatScreen from '../Screens/Dashboard/Chat/PersonalChatScreen';
import ProfileFriendScreen from '../Screens/Dashboard/Friends/ProfileFriendScreen';

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
    ProfileFriend: {screen: ProfileFriendScreen},
    Personal: {screen: PersonalChatScreen},
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
