import React, { useRef } from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import mie from '@maxklema/mie-api-tools';

const WebViewScreen = () => {
    

    const webViewRef = useRef(null);

    const getCookie = (navState) => {
        const { url } = navState;

        if (url.endsWith('webchart.cgi?func=omniscope')) {
            
            //inject Javascript into landing page
            webViewRef.current.injectJavaScript(`
                (function() {
                    
                    fetch('${mie.URL.value}')
                    .then(response => {
                        let dataToReturn = {'Cookie': response.headers.get('x-lg_session_id'), 'Username': response.headers.get('X-lg_username')};
                        window.ReactNativeWebView.postMessage(JSON.stringify(dataToReturn));
                    })
                })();    
            `);

        }

    }

    const onMessage = async (event) => {
        
        const data = JSON.parse(event.nativeEvent.data);
        mie.Cookie.value = data.Cookie;

        //get Patient ID
        let JSON_data;
        JSON_data = await mie.retrieveRecord("patients", ["pat_id"], { username: data.Username });
        mie.User_PatID.value = `${JSON_data['0']['pat_id']}`;
    
        console.log('----------------------');
        console.log(mie.User_PatID.value);
        console.log(mie.Cookie.value);
    }


    return (
        <View style={styles.container}>
            <WebView 
                ref={webViewRef}
                style={styles.webview} 
                source={{ uri: mie.URL.value }}
                onNavigationStateChange={getCookie} 
                onMessage={onMessage}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                thirdPartyCookiesEnabled={true}
                sharedCookiesEnabled={true}
            />
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