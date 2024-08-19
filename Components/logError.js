import React, { useEffect, useState } from "react"
import * as FileSystem from 'expo-file-system'
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import InputButton from "./Inputs/inputButton";

//write logs
const logError = async (error) => {

    const logURI = FileSystem.documentDirectory + "log.json";
    const logData = JSON.parse(await FileSystem.readAsStringAsync(logURI));
    const timestamp = Date.now();

    logData[timestamp] = {
        "Time": timestamp,
        "Log": error
    }

    await FileSystem.writeAsStringAsync(logURI, JSON.stringify(logData));
}

//display logs
const LogScreen = () => {

    const [storedSystems, setStoredSystems] = useState();

    useEffect(() => {
        (async () => {
            const logURI = FileSystem.documentDirectory + "log.json";
            const logData = JSON.parse(await FileSystem.readAsStringAsync(logURI));
            let logs = [];

            for (const log in logData){
                logs.push(logData[log]);
            }

            setStoredSystems(logs)
            console.log(logs);
        })();
    }, [])
    
    const clearLogs = async () => {
        const logURI = FileSystem.documentDirectory + "log.json";
        await FileSystem.writeAsStringAsync(logURI, JSON.stringify({}));
        setStoredSystems([]);
    }

    return (
        <ScrollView style={styles.container}>
            {storedSystems?.map((log, index) => (
                <View key={index} style={styles.log}>
                    <Text style={styles.timestamp}>{log["Time"]}</Text>
                    <Text>{log["Log"]}</Text>
                </View>
            ))}
            <InputButton 
                text="Clear Logs"
                onPress={() => clearLogs()}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: '5%',
        paddingVertical: '5%'
    },
    log: {
        marginBottom: '3%',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: '3%'
    },
    timestamp: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: '1%'
    }
})


export { LogScreen, logError }