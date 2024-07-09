import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  StyleSheet, 
  Text, 
  View,
  SafeAreaView, 
  Image,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import mie from '@maxklema/mie-api-tools';
import InputBox from './../../Components/inputBox';
import InputButton from './../../Components/inputButton';
import Warning from './../../Components/warning';
import { Button } from 'react-native-paper';

const UrlScreen = ({ navigation }) => {

    const [text, onChangeText] = useState('');
    const [onLoad, setOnload] = useState(true);
    const [isError, setIsError] = useState(true);
    const [warning, setWarning ] = useState('Invalid WebChart URL');
    const [showWarning, setShowWarning] = useState(false);
    const [storedSystems, setStoredSystems] = useState([]);


    useFocusEffect(
      React.useCallback( () => {

          async function setSystemsCookie() {
          
            const user_systems = await AsyncStorage.getItem('wc-system-urls');
            console.log(user_systems);
            //await AsyncStorage.removeItem('wc-system-urls');
            if (!user_systems){
              let WC_Systems = {
                name: "WC_Systems",
                system_URLS: []
              };
              setStoredSystems[WC_Systems.system_URLS];
              await AsyncStorage.setItem("wc-system-urls", JSON.stringify(WC_Systems));
            } else {
              const parsed_us = JSON.parse(user_systems);
              setStoredSystems(parsed_us.system_URLS);
            }
            
          }

          setSystemsCookie(); 
          
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
        if (!text.startsWith('https://')){
            setWarningMessage('URL must begin with https://', true);
            onChangeText(text);
            return;
        }
        fetch(text, config)
        .then(response => {
            if (response.status == 200){
                setWarningMessage('Invalid WebChart URL', true);
            } else if (response.status == 401) {
                setWarningMessage('Valid WebChart URL', false);
            }
        })
        .catch(() => {
            setWarningMessage('Invalid WebChart URL', true);
            });
        onChangeText(text);
    };

    function parseURL(URL){
        URL != '' ? mie.practice.value = URL.substring(8, URL.indexOf('.')) : mie.practice.value = text.substring(8, text.indexOf('.'));
        URL == '' ? mie.URL.value = text.substring(0,text.indexOf(".com")+4) + '/webchart.cgi' : mie.URL.value = URL;
    }

    async function navigateToLogin(URL){
        if (isError && URL == ''){
            setIsError(true);
            setWarning('Invalid WebChart URL');
        } else {

            parseURL(URL);

            const user_Systems = JSON.parse(await AsyncStorage.getItem('wc-system-urls'));
            const user_Systems_URLS = user_Systems.system_URLS;

            //check if URL is already stored
            if (!user_Systems_URLS.includes(mie.URL.value)) {
              user_Systems_URLS.unshift(mie.URL.value);
              user_Systems.system_URLS = user_Systems_URLS;
              await AsyncStorage.setItem('wc-system-urls', JSON.stringify(user_Systems)); 
            } else { 
              //set URL to the front of the list
              user_Systems_URLS.splice(user_Systems_URLS.indexOf(mie.URL.value), 1);
              user_Systems_URLS.unshift(mie.URL.value);
              user_Systems.system_URLS = user_Systems_URLS;
            await AsyncStorage.setItem('wc-system-urls', JSON.stringify(user_Systems)); 
            }
            

            navigation.navigate('WebView');
        }
    }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.kbContainer}>
        <SafeAreaView style={styles.container}>
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
                placeholder="WebChart URL"
                text={ text }
                onChangeText={ validateURL }
            />
            <Warning text={ warning } style={ [!isError && styles.validURL, (showWarning && isError ) && styles.invalidURL ] }/>
            <InputButton 
                text="Continue"
                style={ isError && styles.nullifyButton }
                onPress={ () => navigateToLogin('') }
            />
            </View>
            { storedSystems.length > 0 ?
            <View style={ styles.Container_RecentSystems }>
                <Text style={styles.welcomeInstructions}>Recent Systems</Text>
                { storedSystems.slice(0,3)?.map((URL, index) => (
                  <Button onPress={() => navigateToLogin(URL)} key={index} style={ styles.recent_URL_Button} >
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
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
    opacity: '0.4'
  },
  recent_URL_Button: {
    marginTop: '3%',
    backgroundColor: 'rgb(250,250,250)',
    width: '75%',
    alignSelf: 'center'
  },
  Button_Text: {
    color: 'rgb(50,50,50)',
    textAlign: 'center',
    fontSize: '14',
  }
 
});

export default UrlScreen;
