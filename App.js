import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  SafeAreaView, 
  TextInput,
  Pressable,
  Image
} from 'react-native';
import mie from '@maxklema/mie-api-tools';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default function App() {

  mie.Cookie.value = "1b1279e8-2fd2-4e6d-9a38-1694d91901cd";
  mie.URL.value = "https://mieinternprac.webchartnow.com/webchart.cgi";
  mie.practice.value = "mieinternprac";
  mie.username.value = "maxklema";
  mie.password.value = "Minecraftguy!910";

  // mie.getCookie()
  // .then(() => {
  //   console.log(mie.Cookie.value);
  // })

  const [URL, onChangeURL] = useState('');
  const [isError, setIsError] = useState(false);

  function validateURL(){
    fetch(URL)
    .then(response => {
      if (response.status == 200){
        setIsError(true)
      } else if (response.status == 401)
        setIsError(false)
    })
    .catch(err => {
      console.log(err);
    });
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
          <TextInput
            style={[styles.input, isError && styles.inputError]}
            value={ URL }
            onChangeText={ onChangeURL }
            placeholder='Webchart URL'
            keyboardType="url" // This sets the keyboard type to optimize for URLs
            autoCapitalize="none" // Prevents auto-capitalization
            autoCorrect={false}
          />
          <Pressable style={styles.button} onPress={() => validateURL()}>
            <Text style={styles.text}>Continue</Text>
          </Pressable>
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
  button: {
    backgroundColor: '#e87848',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: 25,
    borderRadius: 15,
    marginTop: '3%'
  },
  text: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    lineHeight: 21,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    width: '75%',
    margin: 12,
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    borderRadius: 10
  },
  inputError: {
    borderColor: 'red'
  }
});
