import React, { useState, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, View, Switch } from 'react-native';
import mie from '@maxklema/mie-api-tools-lite';
import InputButton from '../../Components/Inputs/inputButton';
import DataCell from '../../Components/Cells/dataCell';
import { SettingsContext } from '../Context/context';
import Container from '../../Components/Container';
import ContactsWidget from './Contact Component/Contacts';
import * as FileSystem from 'expo-file-system';
import DataLocked from '../../Components/Verification/DataLocked';

import detectAppState from '../../Hooks/detectAppState';

const Settings = ({navigation}) => {

    const [isSession, setIsSession] = useState(false);
    const [sessionData, setSessionData] = useState('');
    const [storedSystems, setStoredSystems] = useState([]);    
    const [userSystemsRaw, setUserSystemsRaw] = useState({});
    const {isToggled, setIsToggled} = useContext(SettingsContext);
    const [dataLocked, setDataLocked] = useState(false);
    
    const toggleSwitch = async (option) => {
        setIsToggled((prevSettings) => ({
            ...prevSettings,
            [option]: !prevSettings[option]
        }));
        await AsyncStorage.setItem(option, `${!isToggled[option]}`)
    }

    detectAppState(navigation);

    useFocusEffect(
        React.useCallback(() => {
            (async () => {
                setDataLocked(false);
                setIsSession(false);
                
                //session ID
                const sessionURI = FileSystem.documentDirectory + "session.json";
                let sessionData = JSON.parse(await FileSystem.readAsStringAsync(sessionURI));
                
                if (sessionData['session_id'] != 'no session' && sessionData['session_id'] != null){
                    setSessionData(sessionData['session_id']);
                    if (sessionData['wc_URL'] != '')
                        setIsSession(true);
                }

                // Systems URLs
                const systemsURI = FileSystem.documentDirectory + "systems.json";            
                const systemsData = JSON.parse(await FileSystem.readAsStringAsync(systemsURI));

                if (systemsData)
                    setStoredSystems(systemsData['recent_systems']);

                setUserSystemsRaw(systemsData);

                // check if user is allowed to access session ID
                if (sessionData["canAccessSessionID"] == false)
                    setDataLocked(true);

            })();
        }, [])
    )

    const deleteData = async (type, data) => {
        switch(type) {
            case "session":
                await FileSystem.writeAsStringAsync((FileSystem.documentDirectory + "session.json"), JSON.stringify({"session_id": "no session", "wc_handle": "", "wc_URL": ""}));           
                setSessionData('');
                setIsSession(false);
                break;
            case "system":
                let systems = storedSystems.filter(function (system) { return system["URL"] != data});                        
                setStoredSystems(systems);

                let userSystemsWhole = userSystemsRaw;
                userSystemsWhole["recent_systems"] = systems;
                await FileSystem.writeAsStringAsync((FileSystem.documentDirectory + "systems.json"), JSON.stringify(userSystemsWhole));

                //check if URL is associated with current session
                const sessionURI = FileSystem.documentDirectory + "session.json";
                let sessionData = JSON.parse(await FileSystem.readAsStringAsync(sessionURI));

                if (sessionData['wc_URL'] == data){
                    sessionData['wc_URL'] = "";
                    await FileSystem.writeAsStringAsync(sessionURI, JSON.stringify(sessionData));
                    setIsSession(false);
                }

                break;        
        }
    };

    const deleteSystems = async() => {
        let user_systems_whole = userSystemsRaw;
        user_systems_whole.system_URLS = []
        setStoredSystems(user_systems_whole.system_URLS);
        await FileSystem.writeAsStringAsync((FileSystem.documentDirectory + "systems.json"), JSON.stringify(user_systems_whole));        
        
        //update session data
        const sessionURI = FileSystem.documentDirectory + "session.json";
        let sessionData = JSON.parse(await FileSystem.readAsStringAsync(sessionURI));
        sessionData['wc_URL'] = "";
        await FileSystem.writeAsStringAsync(sessionURI, JSON.stringify(sessionData));
        
        setIsSession(false);
    }

    const openSystem = async (data) => {
        
        mie.practice.value = data["handle"]
        mie.URL.value = data["URL"];

        const sessionURI = FileSystem.documentDirectory + "session.json";
        let sessionData = JSON.parse(await FileSystem.readAsStringAsync(sessionURI));

        sessionData['wc_URL'] = mie.URL.value;
        sessionData['wc_handle'] = mie.practice.value;

        await FileSystem.writeAsStringAsync(sessionURI, JSON.stringify(sessionData));

        navigation.navigate('WebChart');
    }

    return (
        <Container style={styles}>
            <View style={styles.parent_container}>

                {/* Toggle Automatic WC */}
                <View style={styles.toggleContainer}>
                    <Text style={styles.toggleText} >Automatic WebChart Launch</Text>
                    <Switch 
                        onValueChange={() => toggleSwitch('automatic_wc_launch')}
                        value={isToggled.automatic_wc_launch}
                        trackColor={{false: '#adadad', true: '#d65b27'}}
                        thumbColor={isToggled ? '#f4f3f4' : '#f4f3f4'}
                        ios_backgroundColor="#adadad"
                    />
                </View>

                {/* Toggle Bottom Navigation WC */}
                <View style={styles.toggleContainer}>
                    <Text style={styles.toggleText} >WebChart Bottom Navigation</Text>
                    <Switch 
                        onValueChange={() => toggleSwitch('webview_bottom_navbar')}
                        value={isToggled.webview_bottom_navbar}
                        trackColor={{false: '#adadad', true: '#d65b27'}}
                        thumbColor={isToggled ? '#f4f3f4' : '#f4f3f4'}
                        ios_backgroundColor="#adadad"
                    />

                </View>

                {/* WebChart Contacts Stored on Device */}
                <ContactsWidget navigation={navigation} isSession={isSession} dataLocked={dataLocked}/>
                
                {/* Systems Data  */}
                <View style={styles.systems_container}>
                    <View style={ styles.systemsDataHeader}>
                        <Text style={styles.headerSy}>Systems Data</Text>
                        { storedSystems.length > 1 ? 
                            <InputButton onPress={deleteSystems} text="Remove All" textStyle={ styles.removeAllButtonText} style={styles.removeAllButton}></InputButton> :
                            <></>
                        }
                    </View>
                    { storedSystems.length > 0 ?
                        <View>
                            { storedSystems?.map((system, index) => (
                                <DataCell openMethod={() => openSystem(storedSystems[index])} deleteMethod={deleteData} key={index} data={system["URL"]} type="system" />
                            ))} 
                        </View> :
                        <View style={styles.noData}>
                            <Text>No WebChart systems present. Your systems will appear here when you add a valid WebChart URL.</Text>
                        </View>
                    }
                    
                </View>

                {/* Session Storage */}
                <View style={styles.session_container}>
                    <Text style={styles.header}>Session Data</Text>
                    { dataLocked ?
                        <DataLocked navigation={navigation}/> :    
                        <DataCell deleteMethod={deleteData} data={sessionData} type="session" />
                    }
                    
                </View>


                <View style={styles.copyright}>
                    <Text style={styles.copyrightTxt}>© 2024 WebChart, All rights reserved</Text>
                </View>                
            </View>
        </Container>
    );
}

const styles = StyleSheet.create({
    parent_container: {
        paddingHorizontal: '8%',
        paddingVertical: '5%',
    },
    header: {
        fontSize: 19,
        fontWeight: '600',
        color: 'rgb(50,50,50)'
    },
    headerSy: {
        fontSize: 19,
        fontWeight: '600',
        color: 'rgb(50,50,50)',
        alignSelf: 'center',
        justifyContent: 'center',
        marginTop: '2%'
    },
    DataContainer: {
        marginTop: '3%',
        paddingHorizontal: '5%',
        paddingVertical: '2%',
        backgroundColor: 'rgb(240,240,240)',
        borderRadius: 12,
        display: 'flex',
        flexDirection: 'row',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center'
    },
    systems_container: {
        marginBottom: '10%'
    },
    systemsDataHeader: {
        display: 'flex',
        alignContent: 'center',
        flexDirection: 'row',
    },
    removeAllButton: {
        backgroundColor: 'transparent',
        paddingVertical: 0,
        paddingHorizontal: 0,
        marginLeft: '3%',
        alignSelf: 'center'
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
    copyright: {
        marginTop: '15%',
        display: 'flex',
        justifyContent: 'center',
    },
    copyrightTxt: {
        textAlign: 'center',
        fontSize: 13,
        color: 'rgb(50,50,50)'
    },
    toggleContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '10%',
    },
    toggleText: {
        alignSelf: 'center',
        fontSize: 17,
        fontWeight: '500'
    },
})

export default Settings;
