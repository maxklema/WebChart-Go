import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider, Text } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import UrlScreen from './Screens/Landing/url';
import WebViewScreen from './Screens/WebView/WebView.native';
import Settings from './Screens/Landing/Settings';
import { SettingsProvider } from './Screens/Context/context';
import interactionsPage from './Screens/Interactions/interactions-page';
import * as FileSystem from 'expo-file-system';
import mie from '@maxklema/mie-api-tools';
import Orientation from './Screens/Landing/orientation';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

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

  const App = () => {

      const [orientation, setOrientation] = useState(false);
      const [isLoading, setIsLoading] = useState(true);

      //create storage JSON files
      useEffect(() => {
        (async () => {

            //set Orientation state
            const orientationURI = FileSystem.documentDirectory + "orientation.json";
            const orientationInfo = await FileSystem.getInfoAsync(orientationURI);
            if (!orientationInfo.exists){
              setOrientation(true);
            } else {
              let orientationData = JSON.parse(await FileSystem.readAsStringAsync(orientationURI));
              if (!orientationData["orientation"])
                setOrientation(true);
            }

            const storageNames = ["systems.json", "session.json", "interactions.json", "contacts.json", "orientation.json"];
            const initialStorageObject = [{ name: "WC_Systems", system_URLS: [] }, {"session_id": "no session", "wc_handle": "No Handle", "wc_URL": ""}, {}, {}, { "orientation": false }];
              
            for (let i = 0; i < storageNames.length; i++){
              await initializeStorage(storageNames[i], initialStorageObject[i]);
            }
            
            const sessionURI = FileSystem.documentDirectory + "session.json";
            const sessionData = JSON.parse(await FileSystem.readAsStringAsync(sessionURI));
            mie.Cookie.value = sessionData.session_id;
            mie.practice.value = sessionData.wc_handle;
            mie.URL.value = sessionData.wc_URL;
            
            setIsLoading(false);
  

        })();

      }, []);

      const initializeStorage = async (fileName, initialObject) => {

        const storageURI = FileSystem.documentDirectory + fileName;
        const storageInfo = await FileSystem.getInfoAsync(storageURI);
          
        if (!storageInfo.exists)
          await FileSystem.writeAsStringAsync(storageURI, JSON.stringify(initialObject));
        
      }

      if (!isLoading) {
        return (
          <SettingsProvider>
            <PaperProvider>
              <NavigationContainer>
              <Stack.Navigator>
                  { orientation && (
                    <Stack.Screen name="Welcome" component={Orientation} options={{ headerShown: false}}/> 
                  )}
                  <Stack.Screen name="Back" component={NavBar} options={{ headerShown: false}}/>
                  <Stack.Screen name='WebChart' component={WebViewScreen} />
              </Stack.Navigator>
              </NavigationContainer>
            </PaperProvider>
          </SettingsProvider>
        );
      } else {
        return (
          <View style={[styles.container, styles.horizontal]}>
            <ActivityIndicator />
          </View>
        )
      }
      
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
    },
    horizontal: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 10,
    },
  });

export default App;
