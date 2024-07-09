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

const Settings = () => {

    const [sessionData, setSessionData] = useState('');
    const [storedSystems, setStoredSystems] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            
            async function getCookie() {
                const session_ID = await AsyncStorage.getItem('mie_session_id');
                const user_systems = await AsyncStorage.getItem('wc-system-urls');
                if (session_ID)
                    setSessionData(session_ID);
                if (user_systems) {
                    const parsed_us = JSON.parse(user_systems);
                    setStoredSystems(parsed_us.system_URLS);
                }
            }

            getCookie();


        })
    )

    const deleteData = async (type, data) => {
        if (type == 'session'){
            console.log(data);
            await AsyncStorage.removeItem('mie_session_id');
            setSessionData('');//await AsyncStorage.getItem('mie_session_id'));
        }
    };

    return (
        <Container style={styles}>
            <View style={styles.parent_container}>
                <Text style={styles.header}>Session Data</Text>
                <DataCell data={sessionData} type="session" />
                <Text style={styles.header}>Systems Data</Text>
                { storedSystems?.map((URL, index) => (
                    <DataCell key={index} data={URL} type="system" />
                ))}
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
    DataValue: {
        width: '85%',
    },
    DeleteDataValue: {
        width: '15%',
    },



})

export default Settings;