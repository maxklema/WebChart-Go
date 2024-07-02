import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import UrlScreen from './Screens/Login/url';
import Credentials from './Screens/Login/Credentials';

// Create the Stack Navigator
const Stack = createStackNavigator();

  const App = () => {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Enter URL">
            <Stack.Screen name="Enter URL" component={UrlScreen} />
            <Stack.Screen name="Enter Credentials" component={Credentials} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
  

export default App;
