import React, { useState, useEffect, useRef } from "react";
import { Button, Text } from "react-native-paper";
import * as FileSystem from 'expo-file-system';
import { useFocusEffect } from "@react-navigation/native";
import mie from '@maxklema/mie-api-tools';
import { StyleSheet, View, ActivityIndicator } from "react-native";
import Container from "../../Components/Container";
import InputButton from "../../Components/inputButton";
import InteractionCell from "../../Components/interactionCell";
import WebView from "react-native-webview";
import { sessionCheck } from "../WebView/WebView HTML Injection/sessionCheck";
import Ionicons from 'react-native-vector-icons/Ionicons';

const InteractionsPage = () => {

    const [key, SetKey] = useState(0); //used to re-render webView on load.
    const [isLoading, setIsLoading] = useState(true);
    const [recentInteractions, setRecentInteractions] = useState([]);
    const [isLocked, setIsLocked] = useState(true);
    const webViewRef = useRef(null);
    const [storedSession, setStoredSession] = useState('');

    useFocusEffect(
        React.useCallback(() => {
            const readInteractionsData = async () => {
                try {

                    SetKey(previous => previous + 1);
                    setIsLoading(true);
                    setIsLocked(true);

                    // Load Session Data
                    const sessionURI = FileSystem.documentDirectory + "session.json";
                    const sessionInfo = await FileSystem.getInfoAsync(sessionURI); 

                    //if there is no sessionData file
                    if (!sessionInfo.exists) {
                        const initialContent = JSON.stringify({"session_id": "", "wc_handle": ""});
                        await FileSystem.writeAsStringAsync(sessionURI, initialContent)
                    }

                    let sessionData = await FileSystem.readAsStringAsync(sessionURI);
                    sessionData = JSON.parse(sessionData);

                    console.log(sessionData['wc_handle'], sessionData['session_id'], sessionData["wc_URL"]);

                    setStoredSession(sessionData['session_id']);

                    // Load Interactions Data
                    const fileUri = FileSystem.documentDirectory + "interactions.json";

                    const fileInfo = await FileSystem.getInfoAsync(fileUri);
                    if (!fileInfo.exists) {
                        const initialContent = JSON.stringify({ });
                        await FileSystem.writeAsStringAsync(fileUri, initialContent);
                    } else {
                        let interactionsData = JSON.parse(await FileSystem.readAsStringAsync(fileUri));
                        parseInteractions(interactionsData);
                    }
                } catch (error) {
                    console.error('Error handling interactions file:', error);
                }
            };
        readInteractionsData();

        }, [mie.practice.value])
    );

    const parseInteractions = (interactionsData) => {
        interactionsData = interactionsData[mie.practice.value];

        // add file contents to state varaible
        let interactions = [];
        for (const interaction in interactionsData){
            interactions.push(interactionsData[interaction]);
        }

        setRecentInteractions(interactions.reverse());
    }

    const clearData = async () => {
        const fileUri = FileSystem.documentDirectory + "interactions.json";
        const interactionsData = JSON.parse(await FileSystem.readAsStringAsync(fileUri));
        delete interactionsData[mie.practice.value];
        await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(interactionsData));
        setRecentInteractions([]);
    }

    const headers = {
        'cookie': `wc_miehr_${mie.practice.value}_session_id=${storedSession}`
    }

    //check if returned cookie matches saved cookie
    const onMessage = async (event) => {
        const message = event.nativeEvent.data;
            
        if (message == storedSession)
            setIsLocked(false);

        setIsLoading(false);
        
    }

    return (
        <Container style={styles}>
            <View style={styles.parent_container}>

                {/* Recent Interactions */}
                <View>
                    <View style={styles.recent_interactions_header}>
                        <Text style={styles.headerInteractions}>Recent Interactions</Text>
                        { recentInteractions.length > 0 && !isLoading ?
                            <InputButton onPress={clearData} text="Remove All" textStyle={ styles.removeAllButtonText} style={styles.removeAllButton}/>
                        : <></>}
                    </View>
                    <Text>{mie.practice.value}</Text>
                    {isLocked ? 

                        <View style={styles.locked}>
                            <Ionicons style={styles.lock_icon} name="lock-closed-outline" size={21} color='#FFF'></Ionicons> 
                            <Text style={styles.locked_text}>This content is locked because your session is not valid. Please try logging in again.</Text>
                        </View>
                        
                    : 
                    <>
                        { recentInteractions.length > 0 ? 
                            <View>
                                { recentInteractions?.map((interaction, index) => (
                                    <InteractionCell key={index} data={JSON.stringify(interaction)}/>
                                ))}
                            </View> :
                            <View style={styles.noData}>
                                <Text>You have no recent patient interactions. An interaction will appear when you contact a patient (SMS, Email, Call) through their WebChart.</Text>
                            </View> 
                        }
                    </>
                    }
                    
                </View>

                {/* Hidden WebView for Valid Session purposes */}
                <WebView
                    key={key} 
                    ref={webViewRef}
                    onMessage={onMessage}
                    onNavigationStateChange={() => webViewRef.current.injectJavaScript(sessionCheck)}
                    source={{
                        uri: "https://mieinternprac.webchartnow.com/webchart.cgi?",
                        headers: headers
                    }}
                />

            </View>
        </Container>
    );

}


const styles = StyleSheet.create({

    parent_container: {
        paddingHorizontal: '8%',
        paddingVertical: '5%',
        flex: 1
    },
    headerInteractions: {
        fontSize: 19,
        fontWeight: '600',
        color: 'rgb(50,50,50)',
        marginTop: '2%'
    },
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
    },
    removeAllButtonText: {
        color: 'rgb(100,100,100)',
        fontSize: 13,
        fontWeight: '400',
        textDecorationLine: 'underline'
    },
    noData: {
        width: '100%',
        backgroundColor: 'rgb(240,240,240)',
        marginTop: '3%',
        paddingHorizontal: '5%',
        paddingVertical: '3.5%',
        borderRadius: 12
    },
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
    locked: {
        marginTop: '2%',
        paddingHorizontal: '6.5%',
        paddingVertical: '2.5%',
        backgroundColor: '#278dd6',
        borderRadius: 12,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    // lock_icon: {
    //     marginRight: '3%'
    // },
    locked_text: {
        textAlign: 'left',
        color: 'white',
        marginLeft: '3%',
        width: '95%'
    },
})

export default InteractionsPage;
