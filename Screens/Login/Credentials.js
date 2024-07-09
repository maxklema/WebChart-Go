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

const Credentials = ({ navigation }) => {
  
    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ buttonText, setButtonText ] = useState('Login');
    const [ warning, setWarning ] = useState('Invalid Credentials');
    const [ isError, setIsError ] = useState(true);
    const [onLoad, setOnload] = useState(true);
    const [showWarning, setShowWarning] = useState(false);

    function setWarningMessage(message, success){
        success == true ? setIsError(false) : setIsError(true);
        setWarning(message);
        setOnload(false);
        setShowWarning(true);
        setButtonText('Login');
    }

    // async function getPatID(){ 
    //   let JSON_data;
    //   console.log(mie.practice.value);
    //   JSON_data = await mie.retrieveRecord("patients", [], { pat_id: 18});
    //   console.log(JSON.stringify(JSON_data));
    //   //mie.User_PatID.value = `${JSON_data['0']['pat_id']}`;
    // }

    async function validateLogin() {
        setButtonText('Loading');
        if (username.length == 0 || password.length == 0){
            setWarningMessage("Credentials cannot be blank", false);
            return;
        }
        setShowWarning(false);
        setOnload(true);
        mie.username.value = username;
        mie.password.value = password;
        try {
          console.log(mie.URL.value);
           await mie.getCookie()
            .then(() => {
                console.log(mie.Cookie.value);
                setWarningMessage('Successful Login', true);
                navigation.reset({
                  index: 0,
                  routes: [{ name: `Main` }],
                });
            })
        } catch (err) {
            console.error(err);
            setWarningMessage('Invalid Credentials', false);
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
                    <Text style={styles.welcomeMessage}>{mie.practice.value}</Text>
                    <Text style={styles.welcomeInstructions}>Enter your WebChart Credentials</Text>
                </View>
                <View style={styles.fields}>
                    <InputBox
                        placeholder="Username"
                        text = { username }
                        onChangeText={ setUsername }
                        style={ (!onLoad && isError) && styles.inputError }
                    />
                    <InputBox
                        placeholder="Password"
                        style={ (!onLoad && isError) && styles.inputError }
                        text = { password }
                        onChangeText={ setPassword }
                        secureTextEntry={true}
                    />
                    <Warning text={ warning } style={[!isError && styles.validLogin,(showWarning && isError) && styles.invalidLogin]} />
                    <InputButton 
                        text={ buttonText }
                        onPress={() => validateLogin() }
                    />
                </View>

            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kbContainer: {
    flex: 1
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
  fields: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '20%'
  },
  invalidLogin: {
    display: 'flex'
  },
  validLogin: {
     backgroundColor: '#69b57a',
     display: 'flex'
  },
  inputError: {
    borderColor: 'red'
  }
 
});

export default Credentials;
