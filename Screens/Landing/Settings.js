import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  StyleSheet, 
  Text, 
  View,
  ScrollView,
  SafeAreaView, 
} from 'react-native';
import mie from '@maxklema/mie-api-tools';
import InputBox from '../../Components/inputBox';
import InputButton from '../../Components/inputButton';
import Warning from '../../Components/warning';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DataCell from '../../Components/DataCell';
import { Button } from 'react-native-paper';

const Container = ({children}) => {
    return (
        <SafeAreaView  style={styles.SAVContainer}>
            <ScrollView alwaysBounceVertical={false}>
                {React.Children.map(children, (child) => 
                    React.cloneElement(child, {
                        style: [child.props.style],
                    })
                )}

            </ScrollView>
        </SafeAreaView>
    );
}

const Settings = ({navigation}) => {

    const [sessionData, setSessionData] = useState('');
    const [storedSystems, setStoredSystems] = useState([]);
    const [userSystemsRaw, setUserSystemsRaw] = useState({});

    useFocusEffect(
        React.useCallback(() => {
            
            async function getCookie() {
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

            getCookie();

        }, [])
    )

    const deleteData = async (type, data) => {
        if (type == 'session'){
            await AsyncStorage.removeItem('mie_session_id');           
            setSessionData('');
        } else {
            let systems = storedSystems.filter(function (url) { return url != data});
            setStoredSystems(systems);
            let user_systems_whole = userSystemsRaw;
            user_systems_whole.system_URLS = systems;
            await AsyncStorage.setItem('wc-system-urls', JSON.stringify(user_systems_whole));
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
        navigation.navigate('WebView');
    }

    return (
        <Container style={styles}>
            <View style={styles.parent_container}>
                <View style={styles.session_container}>
                    <Text style={styles.header}>Session Data</Text>
                    <DataCell deleteMethod={deleteData} data={sessionData} type="session" />
                </View>
                <View style={styles.systems_container}>
                    <View style={ styles.systemsDataHeader}>
                        <Text style={styles.headerSy}>Systems Data</Text>
                        { storedSystems.length > 1 ? 
                            <InputButton onPress={deleteSystems} text="Remove All" textStyle={ styles.removeAllButtonText} style={styles.removeAllButton}></InputButton> :
                            <View />
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
                <View style={styles.copyright}>
                    <Text style={styles.copyrightTxt}>© 2024 WebChart, All rights reserved</Text>
                </View>                
            </View>
        </Container>
    );
}

const styles = StyleSheet.create({
    SAVContainer: {
        flex: 1,
        backgroundColor: 'rgb(250,250,250)'
    },
    parent_container: {
        paddingHorizontal: '12.5%',
        paddingVertical: '5%'
    },
    header: {
        fontSize: '19',
        fontWeight: '600',
        color: 'rgb(50,50,50)'
    },
    headerSy: {
        fontSize: '19',
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
        marginTop: '10%'
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
    }



})

export default Settings;