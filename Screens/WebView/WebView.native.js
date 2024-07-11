import React, { useRef, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { WebView } from "react-native-webview";
import AsyncStorage from '@react-native-async-storage/async-storage';
import mie from '@maxklema/mie-api-tools';
import { useFocusEffect } from '@react-navigation/native';
import { homePageJSInject } from "./WebView HTML Injection/homePage";

const WebViewScreen = () => {
    
    const [sessionID, setSessionID] = useState('');
    const webViewRef = useRef(null);

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

    const getCookie = (navState) => {
        const { url } = navState;

        if (url.endsWith('webchart.cgi?func=omniscope')) {
            
            //inject Javascript into landing page
            webViewRef.current.injectJavaScript(homePageJSInject);



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

    return (
        <View style={styles.container}>
            { sessionID !== '' ?
                <WebView 
                    ref={webViewRef}
                    style={styles.webview} 
                    source={{ 
                        uri: mie.URL.value,
                        headers: headers,
                    }}
                    onNavigationStateChange={getCookie} 
                    onMessage={onMessage}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    thirdPartyCookiesEnabled={true}
                    sharedCookiesEnabled={true}
                /> : <Text>Loading...</Text>
            }
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    webview: {
        flex: 1,
    }
})

export default WebViewScreen;