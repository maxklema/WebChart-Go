import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import UrlScreen from './Screens/Landing/url';
import WebViewScreen from './Screens/WebView/WebView.native';
import Settings from './Screens/Landing/Settings';
import { SettingsProvider } from './Screens/Context/context';
import interactionsPage from './Screens/Interactions/interactions-page';
import * as FileSystem from 'expo-file-system';
import mie from '@maxklema/mie-api-tools';

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
                case('Interactions'):
                  iconName = focused ? 'people' : 'people-outline';
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
                name="Interactions"
                component={interactionsPage}
            />
            <Tab.Screen
                name="Settings"
                component={Settings}
            />
        </Tab.Navigator>
    );
  
  }

  const initializeStorage = async (fileName, initialObject) => {

    const storageURI = FileSystem.documentDirectory + fileName;
    const storageInfo = await FileSystem.getInfoAsync(storageURI);

    // await FileSystem.deleteAsync(storageURI);

    if (!storageInfo.exists)
      await FileSystem.writeAsStringAsync(storageURI, JSON.stringify(initialObject));
  }

  const App = () => {

      //create storage JSON files
      useEffect(() => {
          const setupStorage = async () => {
            const storageNames = ["systems.json", "session.json", "interactions.json", "contacts.json"];
            const initialStorageObject = [{ name: "WC_Systems", system_URLS: [] }, {"session_id": "no session", "wc_handle": "No Handle", "wc_URL": ""}, {}, {}];

            for (let i = 0; i < storageNames.length; i++){
              initializeStorage(storageNames[i], initialStorageObject[i]);
            }
            
            const sessionURI = FileSystem.documentDirectory + "session.json";
            const sessionData = JSON.parse(await FileSystem.readAsStringAsync(sessionURI));
            mie.Cookie.value = sessionData.session_id;
            mie.practice.value = sessionData.wc_handle;
            mie.URL.value = sessionData.wc_URL;
          }

          setupStorage();

      }, [])

      return (
        <SettingsProvider>
          <PaperProvider>
            <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Back" component={NavBar} options={{ headerShown: false}}/>
                <Stack.Screen name='WebChart' component={WebViewScreen} />
            </Stack.Navigator>
            </NavigationContainer>
          </PaperProvider>
        </SettingsProvider>
      );
      
  }

export default App;
