import React, { useRef, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { WebView } from "react-native-webview";
import AsyncStorage from '@react-native-async-storage/async-storage';
import mie from '@maxklema/mie-api-tools';
import { useFocusEffect } from '@react-navigation/native';

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

    const injectedJavaScript = `
    
    (function() {

        const container = document.getElementById('wc_main');

        // Function to fetch and inject the HTML content
        function fetchAndInjectHTML(url, callback) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    callback(xhr.responseText);
                }
            };
            xhr.send();
        }

        // Inject the fetched HTML content into the container
        fetchAndInjectHTML('', function(responseText) {
            const newHTML = document.createElement("div");
            newHTML.innerHTML = "<!DOCTYPE html><div class='welcome-container'>    <h1 id='webchart-header'>WebChart Go Features</h1>    <div class='features-container'>        <div class='feature'>            <div class='category'>                <p>Add Patient to Mobile Contacts</p>            </div>            <div class='content'>                <p>By clicking on any patient portal, you will see an option to add a patient to your mobile contacts.</p>            </div>        </div>        <div class='feature'>            <div class='category'>                <p>See Patients Calling You</p>            </div>            <div class='content'>                <p>You no longer need to memorize patient phone numbers. When a call comes in from a phone number that is linked to a patient in your WebChart, you will see their information, all without adding their contact information to your mobile device</p>            </div>        </div>        <div class='feature'>            <div class='category'>                <p>Text Patients from the App</p>            </div>            <div class='content'>                <p>You can text patients right from their patient portal, without having to leave the app.</p>            </div>        </div>        <div class='feature'>            <div class='category'>                <p>Better API Tools</p>            </div>            <div class='content'>                <p>WebChart Go is integrated with technology that allows you to more efficiently filter, edit, and add the exact data you want.</p>            </div>        </div>    </div></div><style>    .welcome-container {        background-color: white;        padding: 5px 20px 5px 20px;        margin-bottom: 10px;        border-radius: 5px;    }    #webchart-header {        font-size: 18px;        background-color: #737373;        font-weight: 800;        color: white;        padding: 10px 15px;        margin-left: -20px;        margin-right: -20px;        margin-top: -5px;        border-radius: 5px 5px 0px 0px;    }    .feature {        display: flex;        background: rgb(252, 252, 252);        flex-direction: column;        margin-top: 20px;        border-radius: 10px;        border: 2px solid rgb(197, 197, 197);        margin-bottom: 20px;    }    .features-container:last-child {        margin-bottom: 10px;    }    .category {        font-size: 18px;        margin-right: 5%;        font-weight: 700;        text-align: left;        background-color: #f0f0ea;        width: 100% !important;        border-radius: 8px 8px 0 0;    }    .category p {        margin-left: 10px;    }    .content {        font-size: 15px;        text-align: left;        padding: 5px 15px;    }</style>";
            container.insertBefore(newHTML, container.firstChild);
        });

        // style.type="text/css";
        // style.innerHTML=""

        
    })();
    true;
    `;

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
                    injectedJavaScript={injectedJavaScript}
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