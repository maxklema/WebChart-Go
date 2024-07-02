import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  SafeAreaView, 
  Pressable,
  Image
} from 'react-native';
import mie from '@maxklema/mie-api-tools';
import InputBox from './Components/inputBox';
import InputButton from './Components/inputButton';
import Warning from './Components/warning';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default function App() {

  
  mie.URL.value = "https://mieinternprac.webchartnow.com/webchart.cgi";
  
  const [text, onChangeText] = useState('');
  const [isError, setIsError] = useState(true);
  const [warning, setWarning ] = useState('Invalid WebChart URL');
  const [showWarning, setShowWarning] = useState(false);

  const validateURL = (text) => {
    setShowWarning(true)
    fetch(text)
    .then(response => {
      if (response.status == 200){
        setIsError(true);
        setWarning('Invalid WebChart URL');
      } else if (response.status == 401) {
        setIsError(false);
        setWarning('Valid WebChart URL');
      }
    })
    .catch(() => {
      setIsError(true);
      setWarning('Invalid WebChart URL');
    });
    onChangeText(text);
  };

  function navigateToLogin(){
    if (isError){
      console.log("Invalid URL");
      setIsError(true);
      setWarning('Invalid WebChart URL');
    } else {
      mie.URL.value = text;
      
    }
  }

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.welcome}>
          <Image 
            source={require('./assets/wc-logo.jpg')}
            style={styles.wc_logo}
          /> 
          <Text style={styles.welcomeMessage}>Welcome to WebChart Go</Text>
          <Text style={styles.welcomeInstructions}>Enter your WebChart URL To get Started</Text>
        </View>
        <View style={styles.fields}>
          <InputBox
            style={ isError && styles.inputError }
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

  );
}

const styles = StyleSheet.create({
  
  fields: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '40%'
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
