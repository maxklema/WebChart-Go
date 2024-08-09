import React, { useRef, useState, useContext } from "react";
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";
import mie from '@maxklema/mie-api-tools-lite';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Clipboard from 'expo-clipboard';
import { SettingsContext } from '../Context/context';
import * as FileSystem from 'expo-file-system';

import sendEmail from "./Patient Messaging/sendEmail";
import getContacts from "./Contacts/getContacts";
import patientCallText from "./Patient Messaging/patientCallText";
import requestTelehealthPermissions from "./telehealth/requestPermissions";
import saveDocument from "./Documents/saveDoc";

import { homePageJSInject } from "./WebView HTML Injection/homePage";
import { patientPageJSInject } from "./WebView HTML Injection/patientPage";
import { DocPageJSInject } from "./WebView HTML Injection/documentsPage";

import detectAppState from "../../Hooks/detectAppState";

const ConditionalWrapper = ({ condition, wrapper, children }) => 
    condition ? wrapper(children) : children;

const WebViewScreen = ({navigation}) => {
    
    const [sessionID, setSessionID] = useState('');
    const webViewRef = useRef(null);
    const { isToggled } = useContext(SettingsContext);
    const [dataLocked, setDataLocked] = useState(false);
    
    const [patID, setPatID] = useState(null);
    const [docID, setDocID] = useState(null);

    //back and forth buttons
    const [goBack, setGoBack] = useState(false);
    const [goForward, setGoForward] = useState(false);
    const [currentURL, setCurrentURL] = useState('');

    detectAppState(navigation);

    useFocusEffect(
        React.useCallback(() => {
            (async () => {

                const sessionURI = FileSystem.documentDirectory + "session.json";
                let sessionData = JSON.parse(await FileSystem.readAsStringAsync(sessionURI));
                setSessionID(sessionData["session_id"]);

                // check if user is allowed to access session ID
                if (sessionData["canAccessSessionID"] == false) 
                    setDataLocked(true);

            })();
        }, [])
    ) 

    const navStateChange = (navState) => {
        const { url } = navState;

        setCurrentURL(url);
        setGoBack(navState.canGoBack);
        setGoForward(navState.canGoForward);

        const patientChartRegex = /pat_id=\d+$/;
        const documentRegex = /doc_id=\d+$/;

        //inject JS into the browser
        if (url.endsWith('webchart.cgi?func=omniscope') || url.endsWith('webchart.cgi?f=omniscope')) {
            webViewRef.current.injectJavaScript(homePageJSInject);
        } else if (patientChartRegex.test(url)) {
            setPatID(parseInt(url.substring(url.indexOf('pat_id=')+7,url.length)))
            webViewRef.current.injectJavaScript(patientPageJSInject);
        } else if (documentRegex.test(url)) {
            setDocID(parseInt(url.substring(url.indexOf('doc_id=') + 7, url.length)))
            webViewRef.current.injectJavaScript(DocPageJSInject);
        }
    }

    const onMessage = async (event) => {
        
        const message = event.nativeEvent.data;

        console.log("Message Received");

        switch(message) {
            case 'getContacts':
                
                console.log("get contacts!");
                getContacts(patID);
                break;

            case 'sendMessage':
                patientCallText(patID, 'Text');
                break;

            case 'makeCall':
                patientCallText(patID, 'Call');
                break;

            case 'sendEmail':
                sendEmail(patID);
                break;

            case 'telehealth Access':
                requestTelehealthPermissions();
                break;

            case 'saveDocument':
                const document = await saveDocument(docID);
                if (document != "")
                    await FileSystem.deleteAsync(document);
                
                break;

            default:

                const data = JSON.parse(event.nativeEvent.data);
                mie.Cookie.value = data.Cookie;
    
                //Store Cookie and Practice in JSON
                const sessionURI = FileSystem.documentDirectory + "session.json";
                let sessionData = JSON.parse(await FileSystem.readAsStringAsync(sessionURI));

                console.log("SESSION DATA " + JSON.stringify(sessionData));

                sessionData["canAccessSessionID"] = true;
                sessionData["session_id"] = mie.Cookie.value;
                sessionData["wc_handle"] = mie.practice.value;
                sessionData["wc_URL"] = mie.URL.value;

                await FileSystem.writeAsStringAsync(sessionURI, JSON.stringify(sessionData));

                let JSON_data = await mie.retrieveRecord("patients", ["pat_id"], { username: data.Username });
                mie.User_PatID.value = `${JSON_data['0']['pat_id']}`;
                break;
        }
        
    }

    const headers = {
        'cookie': dataLocked ? '' : `wc_miehr_${mie.practice.value}_session_id=${sessionID}`
    }

    const navigateBack = () => {
        if (goBack)
            webViewRef.current.goBack(); 
    }

    const navigateForward = () => {
        if (goForward)
            webViewRef.current.goForward(); 
    }

    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(currentURL);
    }

    const refreshPage = () => {
        webViewRef.current.reload();
    }

    return (
        <ConditionalWrapper
            condition={isToggled.webview_bottom_navbar}
            wrapper={children => <SafeAreaView style={styles.container}>{children}</SafeAreaView>}
        >
            { sessionID !== '' ?
                <WebView 
                    ref={webViewRef}
                    style={styles.webview} 
                    source={{ 
                        uri: mie.URL.value,
                        headers: headers
                    }}
                    onNavigationStateChange={navStateChange} 
                    onMessage={onMessage}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    thirdPartyCookiesEnabled={true}
                    sharedCookiesEnabled={true}
                /> : <Text>Loading...</Text>
            }
            {isToggled.webview_bottom_navbar == true ?
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
                        <TouchableOpacity onPress={refreshPage}>
                            <Ionicons name="refresh-outline" size={25} color='#d15a27'></Ionicons>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity onPress={copyToClipboard}>
                            <Ionicons name="copy-outline" size={25} color='#d15a27'></Ionicons>
                        </TouchableOpacity>
                    </View>
                </View> : 
            <View /> }
            
        </ConditionalWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    view: {
        flex: 1,
    },
    WV_Nav_bar: {
        display: 'flex',
        justifyContent: 'space-between',
        paddingHorizontal: '7%',
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