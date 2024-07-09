import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

import UrlScreen from './Screens/Landing/url';
import WebViewScreen from './Screens/WebView/WebView.native';
import Settings from './Screens/Landing/Settings';

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
                case('Enter URL'):
                  iconName = focused ? 'home' : 'home-outline';
                  break;
                case('Settings'):
                  iconName = focused ? 'settings' : 'settings-outline';
                  break;
              }

              return <Ionicons name={iconName} size={size} color={color}/>
            },
            tabBarActiveTintColor: '#d65b27',
          })}>
            <Tab.Screen
                name="Enter URL"
                component={UrlScreen}
            />
            <Tab.Screen
                name="Settings"
                component={Settings}
            />
        </Tab.Navigator>
    );
  
  }


  const App = () => {
    return (
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Enter URL">
              <Stack.Screen name="Enter URL" component={NavBar} options={{ headerShown: false}}/>
              <Stack.Screen name="Settings" component={NavBar} options={{ headerShown: false}}/>
              <Stack.Screen name="WebView" component={WebViewScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    );
  }

export default App;
