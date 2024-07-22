import React, { useState, useEffect, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, Text, View, SafeAreaView, Image, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import mie from '@maxklema/mie-api-tools';
import InputBox from '../../Components/inputBox';
import InputButton from '../../Components/inputButton';
import Warning from '../../Components/warning';
import { Button } from 'react-native-paper';
import { SettingsContext } from '../Context/context';
import * as FileSystem from 'expo-file-system';

const UrlScreen = ({ navigation }) => {

    const [text, onChangeText] = useState('');
    const [onLoad, setOnload] = useState(true);
    const [isError, setIsError] = useState(true);
    const [warning, setWarning ] = useState('Invalid WebChart URL');
    const [showWarning, setShowWarning] = useState(false);
    const [storedSystems, setStoredSystems] = useState([]);

    const { isToggled } = useContext(SettingsContext);

    useEffect( () => {
      
      async function getSettings() {

        if (isToggled.automatic_wc_launch){
          async function launchRecentSystem () {
  
            const systemsURI = FileSystem.documentDirectory + "systems.json";            
            const user_systems = JSON.parse(await FileSystem.readAsStringAsync(systemsURI));

            if (user_systems.system_URLS.length > 0){
              const recentWC = user_systems.system_URLS[0];
              mie.practice.value = recentWC.substring(8, recentWC.indexOf('.'));
              if (!recentWC.includes("/webchart.cgi")) {
                mie.URL.value = recentWC.substring(0,recentWC.indexOf(".com")+4) + '/webchart.cgi';
              } else {
                mie.URL.value = recentWC;
              }

              navigation.navigate('WebChart');
              
            }
    
          }
          launchRecentSystem();
        } 
      }

      getSettings();

    }, [navigation])

    useFocusEffect(
      React.useCallback( () => {

          if (text == ""){
            setIsError(true);
            setWarning("Invalid WebChart URL");
            setShowWarning(false);
            setOnload(true);
          }

          const setSystemsData = async () => {
            const systemsURI = FileSystem.documentDirectory + "systems.json";            
            const systemsData = JSON.parse(await FileSystem.readAsStringAsync(systemsURI));
            setStoredSystems(systemsData.system_URLS);    
          }
          setSystemsData(); 
      }, [])
    );

    const config = {
        method: 'GET',
        headers: {
            'cookie': ''
        }
    }

    function setWarningMessage(message, error) {
        setIsError(error);
        setWarning(message);
    }

    const validateURL = (text) => {
        setOnload(false);
        setShowWarning(true);
        const URLtoFetch = `https://mie.webchartnow.com/webchart.cgi?f=layoutnouser&name=SystemLookup&raw&json&apikey=RKsVJOZZEgLIBuxZzxJjoW3nlMtIBirjdnId6YTvDRD&handle=${text}`;
        
        fetch(URLtoFetch, config)
        .then((response) => response.text())
        .then((result) => {
          let data = JSON.parse(result);
          
          if (data['status'] != 200 && data['status'] != 403){
            setWarningMessage('Invalid WebChart Handle', true);

          } else if (data['status'] == 403){
            setWarningMessage('Handle not Available for Mobile Use', true);

          } else {
            setWarningMessage('Valid WebChart Handle', false);
            mie.practice.value = text;

            if (!data['url'].includes("/webchart.cgi")) {
              mie.URL.value = data['url'] + "webchart.cgi";
            } else {
              mie.URL.value = data['url'];
            }
              

          }
        })
        .catch((e) => {
            setWarningMessage('Invalid WebChart Handle', true);
            });
        onChangeText(text);
    };

    async function navigateToLogin(URL = null){
        if (isError && URL == ''){
            setIsError(true);
            setWarning('Invalid WebChart URL');
        } else {

          if (URL){
            mie.practice.value = URL.substring(8, URL.indexOf('.')) 
            mie.URL.value = URL;
          }

          const systemsURI = FileSystem.documentDirectory + "systems.json";
          const systemsData = JSON.parse(await FileSystem.readAsStringAsync(systemsURI));
          const user_Systems_URLS = systemsData['system_URLS'];

          //check if URL is already stored
          if (!user_Systems_URLS.includes(mie.URL.value)) {
            user_Systems_URLS.unshift(mie.URL.value);
            systemsData.system_URLS = user_Systems_URLS;
            await FileSystem.writeAsStringAsync(systemsURI, JSON.stringify(systemsData));
          } else { 
            //set URL to the front of the list
            user_Systems_URLS.splice(user_Systems_URLS.indexOf(mie.URL.value), 1);
            user_Systems_URLS.unshift(mie.URL.value);
            systemsData.system_URLS = user_Systems_URLS;
            await FileSystem.writeAsStringAsync(systemsURI, JSON.stringify(systemsData));
          }
          
          onChangeText('');

          navigation.navigate('WebChart');
        }
    }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.kbContainer}>
        <SafeAreaView style={styles.container}>
            <StatusBar 
              hidden={false}
              animated={true}
              barStyle="default"
            />
            <View style={styles.welcome}>
            <Image 
                source={require('./../../Assets/wc-logo.jpg')}
                style={styles.wc_logo}
            /> 
            <Text style={styles.welcomeMessage}>Welcome to WebChart Go</Text>
            <Text style={styles.welcomeInstructions}>Enter your WebChart URL To get Started</Text>
            </View>
            <View style={styles.fields}>
            <InputBox
                style={ (!onLoad && isError) && styles.inputError }
                placeholder="WebChart Handle"
                text={ text }
                onChangeText={ validateURL }
            />
            <Warning text={ warning } style={ [!isError && styles.validURL, (showWarning && isError ) && styles.invalidURL ] }/>
            <InputButton 
                text="Continue"
                disabled={isError}
                style={ isError && styles.nullifyButton }
                onPress={ () => navigateToLogin() }
            />
            </View>
            { storedSystems.length > 0 ?
            <View style={ styles.Container_RecentSystems }>
                <Text style={styles.welcomeInstructions}>Recent Systems</Text>
                { storedSystems.slice(0,3)?.map((URL, index) => (
                  <Button onPress={() => navigateToLogin(URL)} key={index} style={ styles.recent_URL_Button}>
                    <Text style={ styles.Button_Text }>{URL}</Text>
                  </Button>
                ))}
            </View>
              : <View></View>
            }
        
        
        </SafeAreaView>
    </KeyboardAvoidingView>

  );
}

const styles = StyleSheet.create({
  kbContainer: {
    flex: 1,
  },
  Container_RecentSystems: {
    marginTop: '10%',
    display: 'flex',
    justifyContent: 'center',
    width: '100%',

  },
  fields: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '20%'
  },
  wc_logo: {
    alignSelf: 'center',
    marginBottom: '5%',
    height: 50,
    width: 50
  },
  welcomeMessage: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeInstructions: {
    fontSize: 17,
    marginTop: '3%',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgb(250,250,250)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: '8%'
  },
  inputError: {
    borderColor: 'red'
  },
  validURL: {
    backgroundColor: '#69b57a',
    display: 'flex'
  },
  invalidURL: {
    display: 'flex'
  },
  nullifyButton: {
    opacity: 0.4
  },
  recent_URL_Button: {
    marginTop: '3%',
    backgroundColor: 'rgb(240,240,240)',
    width: '100%',
    alignSelf: 'center'
  },
  Button_Text: {
    color: 'rgb(50,50,50)',
    textAlign: 'center',
    fontSize: 14,
  }
 
});

export default UrlScreen;
