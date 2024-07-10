import React, {Component, useEffect, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SettingsContext } from './Screens/Context/context';
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


  const App = ({ navigation }) => {

    const {isToggled, setIsToggled} = useContext(SettingsContext);

    useEffect(() => {

      if (isToggled){
        async function launchRecentSystem () {

          const user_systems = await AsyncStorage.getItem('wc-system-urls');
  
          if (user_systems) {
            const parsed_US = JSON.parse(user_systems);
            const recentWC = parsed_US.system_URLS[0];
            mie.practice.value = recentWC.substring(8, recentWC.indexOf('.'));
            mie.URL.value = recentWC.substring(0,recentWC.indexOf(".com")+4) + '/webchart.cgi';
            navigation.navigate('WebView');
          
          }
  
        }
  
        launchRecentSystem();
      }

    }, [navigation]);

      return (
          <PaperProvider>
            <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={NavBar} options={{ headerShown: false}}/>
                <Stack.Screen name="Options" component={NavBar} options={{ headerShown: false}}/>
                <Stack.Screen name="WebView" component={WebViewScreen} />
            </Stack.Navigator>
            </NavigationContainer>
          </PaperProvider>
      );
      
  }

export default App;
