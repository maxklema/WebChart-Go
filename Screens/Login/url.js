import React, { useState } from 'react';
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

const UrlScreen = ({ navigation }) => {
   
    const [text, onChangeText] = useState('');
    const [onLoad, setOnload] = useState(true);
    const [isError, setIsError] = useState(true);
    const [warning, setWarning ] = useState('Invalid WebChart URL');
    const [showWarning, setShowWarning] = useState(false);

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

    function parseURL(){
        mie.practice.value = text.substring(8, text.indexOf('.'));
        mie.URL.value = text.substring(0,text.indexOf(".com")+4) + '/webchart.cgi';
        console.log(mie.URL.value);
    }

    function navigateToLogin(){
        if (isError){
            setIsError(true);
            setWarning('Invalid WebChart URL');
        } else {
            parseURL();
            navigation.navigate('Enter Credentials')
        }
    }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.kbContainer}>
        <SafeAreaView style={styles.container}>
            <View style={styles.welcome}>
            <Image 
                source={require('./../../assets/wc-logo.jpg')}
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
                onPress={ () => navigateToLogin() }
            />
            </View>
        
        </SafeAreaView>
    </KeyboardAvoidingView>

  );
}

const styles = StyleSheet.create({
  kbContainer: {
    flex: 1,
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
  }
 
});

export default UrlScreen;
