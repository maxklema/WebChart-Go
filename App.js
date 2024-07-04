import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

import UrlScreen from './Screens/Login/url';
import Credentials from './Screens/Login/Credentials';
import Dashboard from './Screens/Home/Dashboard';
import Profile from './Screens/Home/Profile';

// Create the Stack Navigator
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

  function NavBar() {
    return (
        <Tab.Navigator
          screenOptions={({route}) => ({
            tabBarIcon: ({focused, color, size }) => {
              let iconName;

              switch(route.name){
                case('Home'):
                  iconName = focused ? 'home' : 'home-outline';
                  break;
                case('Records'):
                  iconName = focused ? 'folder' : 'folder-outline';
                  break;
                case('Integrations'):
                  iconName = focused ? 'flash' : 'flash-outline';
                  break;
                case('You'):
                  iconName = focused ? 'person' : 'person-outline';
                  break;
              }

              return <Ionicons name={iconName} size={size} color={color}/>
            },
            tabBarActiveTintColor: '#d65b27',
          })}>
            <Tab.Screen
                name="Home"
                component={Dashboard}
            />
            <Tab.Screen
                name="Records"
                component={Dashboard}
            />
            <Tab.Screen
                name="Integrations"
                component={Dashboard}
            />
            <Tab.Screen
                name="You"
                component={Profile}
            />
        </Tab.Navigator>
    );
  
  }


  const App = () => {
    return (
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Enter URL">
              <Stack.Screen name="Enter URL" component={UrlScreen} />
              <Stack.Screen name="Enter Credentials" component={Credentials} />
              <Stack.Screen name="Main" component={NavBar} options={{ headerShown: false}}/>
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    );
  }

export default App;
