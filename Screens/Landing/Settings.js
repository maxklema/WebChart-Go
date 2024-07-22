import React, { useState, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, View,Switch } from 'react-native';
import mie from '@maxklema/mie-api-tools';
import InputButton from '../../Components/inputButton';
import DataCell from '../../Components/Cells/dataCell';
import { SettingsContext } from '../Context/context';
import * as Contacts from 'expo-contacts';
import Container from '../../Components/Container';
import ContactsWidget from './Contact Component/Contacts';

const Settings = ({navigation}) => {

    const [sessionData, setSessionData] = useState('');
    const [storedSystems, setStoredSystems] = useState([]);    
    const [userSystemsRaw, setUserSystemsRaw] = useState({});
    const {isToggled, setIsToggled} = useContext(SettingsContext);
    
    const toggleSwitch = async (option) => {
        setIsToggled((prevSettings) => ({
            ...prevSettings,
            [option]: !prevSettings[option]
        }));
        await AsyncStorage.setItem(option, `${!isToggled[option]}`)
    }

    useFocusEffect(
        React.useCallback(() => {
            const getSessionInformation = async () => {
                const session_ID = await AsyncStorage.getItem('mie_session_id');
                const user_systems = await AsyncStorage.getItem('wc-system-urls');
                if (session_ID != '' && session_ID != null)
                    setSessionData(session_ID);
                if (user_systems) {
                    const parsed_us = JSON.parse(user_systems);
                    setStoredSystems(parsed_us.system_URLS);
                }

                setUserSystemsRaw(JSON.parse(user_systems));
            }
            getSessionInformation();
        }, [])
    )

    const deleteData = async (type, data) => {
        switch(type) {
            case "session":
                await AsyncStorage.removeItem('mie_session_id');           
                setSessionData('');
                break;
            case "system":
                let systems = storedSystems.filter(function (url) { return url != data});
                setStoredSystems(systems);
                let user_systems_whole = userSystemsRaw;
                user_systems_whole.system_URLS = systems;
                await AsyncStorage.setItem('wc-system-urls', JSON.stringify(user_systems_whole));
                break;
        }
    
    };

    const deleteSystems = async() => {
        let user_systems_whole = userSystemsRaw;
        user_systems_whole.system_URLS = []
        setStoredSystems(user_systems_whole.system_URLS);
        await AsyncStorage.setItem('wc-system-urls', JSON.stringify(user_systems_whole));
        
    }

    const openSystem = async(data) => {
        mie.practice.value = data.substring(8, data.indexOf('.'));
        mie.URL.value = data.substring(0,data.indexOf(".com")+4);
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
                <ContactsWidget />
                
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
                            { storedSystems?.map((URL, index) => (
                                <DataCell openMethod={openSystem} deleteMethod={deleteData} key={index} data={URL} type="system" />
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
                    <DataCell deleteMethod={deleteData} data={sessionData} type="session" />
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
