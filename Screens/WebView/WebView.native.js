import React, { useRef, useState } from "react";
import { StyleSheet, Clipboard, View, Text, SafeAreaView, TouchableOpacity} from "react-native";
import { WebView } from "react-native-webview";
import AsyncStorage from '@react-native-async-storage/async-storage';
import mie from '@maxklema/mie-api-tools';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { homePageJSInject } from "./WebView HTML Injection/homePage";
import { patientPageJSInject } from "./WebView HTML Injection/patientPage";

const WebViewScreen = () => {
    
    const [sessionID, setSessionID] = useState('');
    const webViewRef = useRef(null);

    //back and forth buttons
    const [goBack, setGoBack] = useState(false);
    const [goForward, setGoForward] = useState(false);
    const [currentURL, setCurrentURL] = useState('');

    useFocusEffect(
        React.useCallback(() => {

            //AsyncStorage.removeItem('mie_session_id');
            async function getStoredCookie() {
                const mieSession = await AsyncStorage.getItem('mie_session_id');
                if (!mieSession){
                    await AsyncStorage.setItem('mie_session_id', '');
                }
                setSessionID(mieSession);
            }
            getStoredCookie();
        }, [])
    )

    const navStateChange = (navState) => {
        const { url } = navState;

        setCurrentURL(url);
        setGoBack(navState.canGoBack);
        setGoForward(navState.canGoForward);

        //inject JS into the browser
        if (url.endsWith('webchart.cgi?func=omniscope')) {
            webViewRef.current.injectJavaScript(homePageJSInject);
        } else if (url.includes('pat_id=55')) {
            webViewRef.current.injectJavaScript(patientPageJSInject);
        }
    }       

    const onMessage = async (event) => {
        
        const data = JSON.parse(event.nativeEvent.data);
        mie.Cookie.value = data.Cookie;
        await AsyncStorage.setItem('mie_session_id', mie.Cookie.value);

        let JSON_data;
        JSON_data = await mie.retrieveRecord("patients", ["pat_id"], { username: data.Username });
        mie.User_PatID.value = `${JSON_data['0']['pat_id']}`;
        
        console.log('----------------------');
        console.log(mie.User_PatID.value);
        console.log(mie.Cookie.value);
    }

    const headers = {
        'cookie': `wc_miehr_${mie.practice.value}_session_id=${sessionID}`
    }

    const navigateBack = () => {
        if (goBack)
            webViewRef.current.goBack(); 
    }

    const navigateForward = () => {
        if (goForward)
            webViewRef.current.goForward(); 
    }

    const copyToClipboard = () => {
        // Clipboard.setString(currentURL);
    }

    return (
        <SafeAreaView style={styles.container}>
            { sessionID !== '' ?
                <WebView 
                    ref={webViewRef}
                    style={styles.webview} 
                    source={{ 
                        uri: mie.URL.value,
                        headers: headers,
                    }}
                    onNavigationStateChange={navStateChange} 
                    onMessage={onMessage}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    thirdPartyCookiesEnabled={true}
                    sharedCookiesEnabled={true}
                /> : <Text>Loading...</Text>
            }
            <View style={styles.WV_Nav_bar}>
                <View style={styles.nav_buttons}>
                    <TouchableOpacity style={styles.backButton} onPress={navigateBack} disabled={!goBack}>
                        { goBack == true ? 
                            <Ionicons name="chevron-back-outline" size={26} color='#d15a27'></Ionicons>
                        : <Ionicons name="chevron-back-outline" size={26} color='#b89282'></Ionicons>
                        }
                    </TouchableOpacity>
                    <TouchableOpacity onPress={navigateForward} disabled={!goForward}>
                        { goForward == true ? 
                            <Ionicons name="chevron-forward-outline" size={26} color='#d15a27'></Ionicons>
                            : <Ionicons name="chevron-forward-outline" size={26} color='#b89282'></Ionicons>
                        }
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity onPress={copyToClipboard}>
                        <Ionicons name="copy-outline" size={25} color='#d15a27'></Ionicons>
                    </TouchableOpacity>
                </View>
            </View>
            
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    webview: {
        flex: 1,
    },
    WV_Nav_bar: {
        display: 'flex',
        justifyContent: 'space-around',
        flexDirection: 'row',
        paddingTop: '2%',
        backgroundColor: 'white'
    },
    backButton: {
        marginRight: '35%'
    },
    nav_buttons: {
        display: 'flex',
        flexDirection: 'row'
    }
})

export default WebViewScreen;