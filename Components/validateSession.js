import React, { useState, useRef, useEffect } from "react";
import { Text } from "react-native-paper";
import * as FileSystem from 'expo-file-system';
import { useFocusEffect } from "@react-navigation/native";
import mie from '@maxklema/mie-api-tools';
import { StyleSheet, View, ActivityIndicator } from "react-native";
import WebView from "react-native-webview";
import { sessionCheck } from "../Screens/WebView/WebView HTML Injection/sessionCheck";
import Ionicons from 'react-native-vector-icons/Ionicons';
import InputButton from "./inputButton";

const ValidateSession = ({children, clearData, header, data, sessionValid}) => {

    const [key, SetKey] = useState(0); //used to re-render webView on load.
    const [isLoading, setIsLoading] = useState(true);
    const [isLocked, setIsLocked] = useState(true);
    const [isSession, setIsSession] = useState();
    const [storedSession, setStoredSession] = useState('');
    const webViewRef = useRef(null);
    

    useFocusEffect(
        React.useCallback(() => {
            const readSessionData = async () => {
                try {

                    SetKey(previous => previous + 1);
                    setIsLoading(true);
                    setIsLocked(true);
                    setIsSession(false);

                    // Load Session Data
                    const sessionURI = FileSystem.documentDirectory + "session.json";
                    let sessionData = JSON.parse(await FileSystem.readAsStringAsync(sessionURI));
                    setStoredSession(sessionData["session_id"]);

                    // console.log(sessionData["wc_URL"], sessionData["session_id"]);
                    if (sessionData["wc_URL"] != "" && sessionData["session_id"] != "no session"){
                        console.log("here???");
                        console.log(sessionData['wc_URL']);
                        setIsSession(true);
                    }

                } catch (error) {
                    console.error('Error handling interactions file:', error);
                }
            };
        readSessionData();

        }, [mie.practice.value])
    );

    useEffect(() => {
        setIsSession(sessionValid);
    }, [sessionValid])

    const headers = {
        'cookie': `wc_miehr_${mie.practice.value}_session_id=${mie.Cookie.value}`
    }

    //check if returned cookie matches saved cookie
    const onMessage = async (event) => {
        const message = event.nativeEvent.data;

        if (message == storedSession)
            setIsLocked(false);

        setIsLoading(false);
        
    }

    return (
        <View>
            <View style={styles.recent_interactions_header}>
                <Text style={styles.headerInteractions}>{header}</Text>
                { data.length > 0 && !isLocked ?
                    <InputButton onPress={clearData} text="Remove All" textStyle={ styles.removeAllButtonText} style={styles.removeAllButton}/>
                : <></>}
            </View>
            <Text>
                { mie.practice.value == "" ? "No Handle" : mie.practice.value}
            </Text>
            {isLoading && isSession ? 
        
                <View style={[styles.widget, styles.loading_widget]}>
                    <ActivityIndicator />
                    <Text style={[styles.left_widget_text, styles.loading_text]}>Validating Session</Text>
                </View> :

                <>
                {isLocked && isSession ? 

                    <View style={styles.widget}>
                        <Ionicons style={styles.lock_icon} name="lock-closed-outline" size={21} color='#FFF'></Ionicons> 
                        <Text style={styles.left_widget_text}>This content is locked because your session is not valid. Please try logging in again.</Text>
                    </View> : 
                    <>
                        { isSession ? 
                            <>{children}</> : 
                            <View style={styles.widget}>
                                <Ionicons style={styles.lock_icon} name="information-circle-outline" size={21} color='#FFF'></Ionicons> 
                                <Text style={styles.left_widget_text}>You must add a WebChart System and log in to access this data.</Text>
                            </View>
                        }
                    </>
                }
                </>
            }

            {/* Hidden WebView for Valid Session purposes */}
            { isSession ? 
                <WebView
                    key={key} 
                    ref={webViewRef}
                    style={styles.webview}
                    sharedCookiesEnabled={true}
                    onMessage={onMessage}
                    onNavigationStateChange={() => webViewRef.current.injectJavaScript(sessionCheck)}
                    source={{ 
                        uri: mie.URL.value,
                        headers: headers
                    }}
                /> : 
                <></>
            }
            
        </View>
            
    );

}

const styles = StyleSheet.create({

    headerInteractions: {
        fontSize: 19,
        fontWeight: '600',
        color: 'rgb(50,50,50)',
        marginTop: '2%'
    },
    // webview: {
    //     height: 300,
    // }, 
    recent_interactions_header: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
    },
    removeAllButton: {
        backgroundColor: 'transparent',
        paddingVertical: 0,
        paddingHorizontal: 0,
        marginLeft: '3%',
        alignSelf: 'center',
        marginBottom: '1%'
    },
    removeAllButtonText: {
        color: 'rgb(100,100,100)',
        fontSize: 13,
        fontWeight: '400',
        textDecorationLine: 'underline'
    },
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    horizontal: {
        flexDireion: 'row',
        justifyContent: 'space-arctound',
        padding: 10,
    },
    widget: {
        marginTop: '3%',
        paddingHorizontal: '6.5%',
        paddingVertical: '2.5%',
        backgroundColor: '#278dd6',
        borderRadius: 12,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    left_widget_text: {
        textAlign: 'left',
        color: '#fff',
        marginLeft: '3%',
        width: '95%'
    },
    loading_widget: {
        backgroundColor: 'rgb(240, 240, 240)',
    },
    loading_text: {
        color: '#000'
    }
})

export default ValidateSession;
