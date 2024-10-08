import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SettingsProvider } from './Screens/Context/context';
import * as FileSystem from 'expo-file-system';
import mie from '@maxklema/mie-api-tools-lite';
import { View, ActivityIndicator, StyleSheet, TouchableOpacity, Text} from 'react-native';

//Components / Screens
import UrlScreen from './Screens/Landing/EnterURL';
import WebViewScreen from './Screens/WebView/WebView.native';
import Settings from './Screens/Landing/Settings';
import interactionsPage from './Screens/Landing/Interactions/interactions-page';
import Orientation from './Screens/Landing/orientation.js';
import LockScreen from './Screens/Landing/Local Verification/lockScreen';
import { LogScreen } from './Components/logError.js';

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
                options={({navigation}) => ({
                  headerRight: () => (
                    <TouchableOpacity onPress={() => navigation.navigate("Dev Logs")}>
                      <Text style={{ color: '#000', marginRight: 10 }}>Dev Logs</Text>
                    </TouchableOpacity>
                  ),
                })}
            />
            <Tab.Screen
                name="Interactions"
                component={interactionsPage}
                options={({navigation}) => ({
                  headerRight: () => (
                    <TouchableOpacity onPress={() => navigation.navigate("Dev Logs")}>
                      <Text style={{ color: '#000', marginRight: 10 }}>Dev Logs</Text>
                    </TouchableOpacity>
                  ),
                })}
            />
            <Tab.Screen
                name="Settings"
                component={Settings}
                options={({navigation}) => ({
                  headerRight: () => (
                    <TouchableOpacity onPress={() => navigation.navigate("Dev Logs")}>
                      <Text style={{ color: '#000', marginRight: 10 }}>Dev Logs</Text>
                    </TouchableOpacity>
                  ),
                })}
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

            await FileSystem.deleteAsync(FileSystem.documentDirectory + "session.json");
            await FileSystem.deleteAsync(FileSystem.documentDirectory + "interactions.json");
            await FileSystem.deleteAsync(FileSystem.documentDirectory + "systems.json");
            await FileSystem.deleteAsync(FileSystem.documentDirectory + "contacts.json");
            await FileSystem.deleteAsync(FileSystem.documentDirectory + "orientation.json");

            await getOrientationData();
            const storageNames = ["systems.json", "session.json", "interactions.json", "contacts.json", "orientation.json", "log.json"];
            const initialStorageObject = [{ recent_systems: [] }, {"session_id": "no session", "wc_handle": "No Handle", "wc_URL": "", "canAccessSessionID": true, "hasLaunched": false}, {}, {}, { "orientation": false }, {}];
          

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

      const getOrientationData = async () => {
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
      }

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
                  <Stack.Screen name='WebChart' component={WebViewScreen} options={({ navigation }) => ({
                  title: mie.practice.value,
                  headerRight: () => (
                    <TouchableOpacity onPress={() => navigation.navigate("Dev Logs")}>
                      <Text style={{ color: '#000', marginRight: 10 }}>Dev Logs</Text>
                    </TouchableOpacity>
                  ),
                })}/>
                  <Stack.Screen name="Lock Screen" component={LockScreen} options={{ headerShown: false }}/>
                  <Stack.Screen name="Dev Logs" component={LogScreen}
                    options={{
                      presentation: 'modal'
                    }}
                  />
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
