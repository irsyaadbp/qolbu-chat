import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';

import ChatScreen from '../Screens/Dashboard/ChatScreen';
import MapsScreen from '../Screens/Dashboard/MapsScreen';
import FriendsScreen from '../Screens/Dashboard/FriendsScreen';

const TabRouter = createMaterialTopTabNavigator(
  {
    Chat: ChatScreen,
    Maps: MapsScreen,
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
