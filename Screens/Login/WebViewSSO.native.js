import React, { useRef } from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import mie from '@maxklema/mie-api-tools';

const WebViewScreen = () => {

    const webViewRef = useRef(null);


    const getCookie = () => {
        
        //inject JS
        webViewRef.current.injectJavaScript(`
            (function() {
                //let cookie = document.cookie;
                //cookie = cookie.slice(-36);
                fetch('${mie.URL.value}')
                .then(response => {   
                    window.ReactNativeWebView.postMessage(response.headers.get('x-lg_session_id'));
                })
            })();    
        `);

    }

    const onMessage = (event) => {
        const cookie = event.nativeEvent.data;
        mie.Cookie.value = cookie;
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