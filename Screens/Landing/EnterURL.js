import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, Text, View, SafeAreaView, Image, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import mie from '@maxklema/mie-api-tools-lite';
import InputBox from '../../Components/Inputs/inputBox';
import InputButton from '../../Components/Inputs/inputButton';
import Warning from '../../Components/warning';
import { Button } from 'react-native-paper';
import * as FileSystem from 'expo-file-system';

import detectAppState from '../../Hooks/detectAppState';

const UrlScreen = ({ navigation }) => {

    const [text, onChangeText] = useState('');
    const [onLoad, setOnload] = useState(true);
    const [isError, setIsError] = useState(true);
    const [warning, setWarning ] = useState('Invalid WebChart URL');
    const [showWarning, setShowWarning] = useState(false);
    const [storedSystems, setStoredSystems] = useState([]);

    useEffect( () => {
      (async () => {
      
        //set canAccessSessionID to false;
        const sessionURI = FileSystem.documentDirectory + "session.json";
        const sessionData = JSON.parse(await FileSystem.readAsStringAsync(sessionURI));
        sessionData["hasLaunched"] = false;
        await FileSystem.writeAsStringAsync(sessionURI, JSON.stringify(sessionData));

        //set orientation to false
        let orientationURI = FileSystem.documentDirectory + "orientation.json";
        let orientationData = JSON.parse(await FileSystem.readAsStringAsync(orientationURI));
      
        if (!orientationData["orientation"]){
          orientationData["orientation"] = true;
          await FileSystem.writeAsStringAsync(orientationURI, JSON.stringify(orientationData));
        } else {
          await navigation.navigate("Lock Screen"); 
        }

      })();
    }, [navigation])

    useFocusEffect(
      React.useCallback( () => {

          if (text == ""){
            setIsError(true);
            setWarning("Invalid WebChart URL");
            setShowWarning(false);
            setOnload(true);
          }

          (async() => {
            const systemsURI = FileSystem.documentDirectory + "systems.json";            
            const systemsData = JSON.parse(await FileSystem.readAsStringAsync(systemsURI));
            setStoredSystems(systemsData['recent_systems']); 
          })();
      }, [])
    );

    detectAppState(navigation);

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
            
            mie.practice.value = data['handle'].toLowerCase();

            if (!data['url'].endsWith("/webchart.cgi")) {
              mie.URL.value = data['url'] + "webchart.cgi";
            } else {
              mie.URL.value = data['url'];
            }              

          }
        })
        .catch(() => {
            setWarningMessage('Invalid WebChart Handle', true);
            });
        onChangeText(text);
    };

    async function navigateToLogin(URL = null){
        if (isError && URL == ''){
            setIsError(true);
            setWarning('Invalid WebChart URL');
        } else {

          const systemsURI = FileSystem.documentDirectory + "systems.json";
          const systemsData = JSON.parse(await FileSystem.readAsStringAsync(systemsURI));
          const recentSystems = systemsData['recent_systems'];
          let system = recentSystems.find(system => system.URL === URL);

          if (!system) {
            let newSystem = { 
              "URL": URL,
              "handle": mie.practice.value
            }

            recentSystems.unshift(newSystem);
            systemsData["recent_systems"] = recentSystems;
            await FileSystem.writeAsStringAsync(systemsURI, JSON.stringify(systemsData));
          } else { 
            mie.URL.value = URL;
            mie.practice.value = system["handle"];

            //set URL to the front of the list
            recentSystems.splice(recentSystems.indexOf(system), 1);
            recentSystems.unshift(system);

            systemsData["recent_systems"] = recentSystems;
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
                source={require('./../../Assets/icon.png')}
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
                onPress={ () => navigateToLogin(mie.URL.value) }
            />
            </View>
            { storedSystems.length > 0 ?
            <View style={ styles.Container_RecentSystems }>
                <Text style={styles.welcomeInstructions}>Recent Systems</Text>
                { storedSystems.slice(0,3)?.map((system, index) => (
                  <Button onPress={() => navigateToLogin(system["URL"])} key={index} style={ styles.recent_URL_Button}>
                    <Text style={ styles.Button_Text }>{system['URL']}</Text>
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
    height: 65,
    width: 65,
    borderRadius: 10
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
