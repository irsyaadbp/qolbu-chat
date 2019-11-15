import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import ChatScreen from '../Screens/Dashboard/Chat/ChatScreen';
import PersonalChatScreen from '../Screens/Dashboard/Chat/PersonalChatScreen';

import MapsScreen from '../Screens/Dashboard/MapsScreen';
import FriendsScreen from '../Screens/Dashboard/Friends/FriendsScreen';

const TabRouter = createMaterialTopTabNavigator(
  {
    Maps: MapsScreen,
    Chat: ChatScreen,
    Friends: FriendsScreen,
  },
  {
    initialRouteName: 'Chat',
    tabBarOptions: {
      activeTintColor: '#fff',
      inactiveTintColor: '#FCBCD0',
      style: {
        backgroundColor: '#FB5286',
        borderColor: 'transparent',
      },
      labelStyle: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
      },
      indicatorStyle: {
        // borderBottomColor: '#fff',
        // borderBottomWidth: 3,
        backgroundColor: 'transparent',
        height: '100%',
        // borderTopColor: '#fff',
        // borderTopWidth: 4,
      },
    },
    tabBarPosition: 'top',
  },
);

export default createAppContainer(TabRouter);
