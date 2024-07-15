import React, { useRef, useState, useContext, useEffect } from "react";
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, Linking} from "react-native";
import { WebView } from "react-native-webview";
import AsyncStorage from '@react-native-async-storage/async-storage';
import mie from '@maxklema/mie-api-tools';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Clipboard from 'expo-clipboard';
import { SettingsContext } from '../Context/context';
import * as Contacts from 'expo-contacts';


import { homePageJSInject } from "./WebView HTML Injection/homePage";
import { patientPageJSInject } from "./WebView HTML Injection/patientPage";

const ConditionalWrapper = ({ condition, wrapper, children }) => 
    condition ? wrapper(children) : children;

const WebViewScreen = () => {
    
    const [sessionID, setSessionID] = useState('');
    const webViewRef = useRef(null);
    const {isToggled, setIsToggled} = useContext(SettingsContext);

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

    const getPatientInfo = async () => {
        
        const fields = ["address1", "address2", "address3", "birth_date", "employer_name", "email", "emergency_phone", "first_name", "last_name", "middle_name", "suffix", "title", "home_phone", "cell_phone" ]

        let patInfo = await mie.retrieveRecord("patients", fields, { pat_id: 18})
        return patInfo;
    }
 
    const getContacts = () => {
        (async () => {
            try {
                const { status } = await Contacts.requestPermissionsAsync();
                if (status === 'granted') {
                    
                    const contact_fields = {
                        "first_name": [Contacts.Fields.FirstName],
                        "last_name": [Contacts.Fields.LastName],
                        "middle_name": [Contacts.Fields.MiddleName],
                        "title": [Contacts.Fields.Prefix],
                        "suffix": [Contacts.Fields.Suffix],
                        "email": [],
                        "home_phone": [],
                        "cell_phone": [],
                        "emergency_phone": [],
                        "birth_date": "",
                        "address1": "",
                        "address2": "",
                        "address3": ""
                    }
                    let patInfo = await getPatientInfo();

                    let contact = {}
                    let emails = []
                    let phones = []
                    let addresses = []

                    for (const key in contact_fields){
                        if (key == "email"){
                            let email = {
                                email: patInfo[0][key],
                                label: "Email"
                            }
                            emails.push(email)
                            contact[Contacts.Fields.Emails] = emails;
                        } else if (key.endsWith("phone")) {
                            let phone = {
                                number: patInfo[0][key],
                                "label": key.substring(0,key.indexOf("_"))
                            }
                            phones.push(phone);
                            contact[Contacts.Fields.PhoneNumbers] = phones;

                        } else if (key == "birth_date") {
                            
                            let raw_birthday = patInfo[0][key];
                            const birth_year = parseInt(raw_birthday.substring(0,4));
                            const birth_month = parseInt(raw_birthday.substring(5,7));
                            const birth_day = parseInt(raw_birthday.substring(8,10));

                            contact[Contacts.Fields.Birthday] =  { 
                                day: birth_day,
                                month: birth_month-1, 
                                year: birth_year 
                            }

                        } else if (key.startsWith('address')) {
                            let address = {
                                label: key,
                                street: patInfo[0][key]
                            }

                            if (patInfo[0][key] != "")
                                addresses.push(address);
                            contact[Contacts.Fields.Addresses] = addresses;
                        } else {
                            contact[contact_fields[key]] = patInfo[0][key];
                        }
                        
                    }

                    // console.log(JSON.stringify(contact));
                    const contactId = await Contacts.addContactAsync(contact);
                    console.log(contactId);
                    

                } else {
                    alert('Cannot add Patient to Contacts');
                }
            } catch (e) {
                console.log(e);
                // const { canAskAgain } = await Contacts.requestPermissionsAsync();
                // if (canAskAgain)
                //     Linking.openSettings();
            }
                        
        })();
    }

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
        
        const message = event.nativeEvent.data;

        if (message == 'getContacts'){
            getContacts();
        } else {
            const data = JSON.parse(event.nativeEvent.data);
            console.log(data.Cookie);
            mie.Cookie.value = data.Cookie;
            await AsyncStorage.setItem('mie_session_id', mie.Cookie.value);

            let JSON_data;
            JSON_data = await mie.retrieveRecord("patients", ["pat_id"], { username: data.Username });
            mie.User_PatID.value = `${JSON_data['0']['pat_id']}`;

            console.log('----------------------');
            console.log(mie.User_PatID.value);
            console.log(mie.Cookie.value);
        }

        
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

    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(currentURL);
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