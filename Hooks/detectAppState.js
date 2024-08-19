import { useEffect } from "react";
import { AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from 'expo-file-system';

const detectAppState = (navigation) => {

    const handleInActiveState = async () => {

        //begin "inactive timer"
        await AsyncStorage.setItem('lastBackgroundTime', Date.now().toString());

        //set canAccessSessionID to false;
        const sessionURI = FileSystem.documentDirectory + "session.json";
        const sessionInfo = await FileSystem.getInfoAsync(sessionURI);

        if (sessionInfo.exists){
            const sessionData = JSON.parse(await FileSystem.readAsStringAsync(sessionURI));
            sessionData["canAccessSessionID"] = false;
            await FileSystem.writeAsStringAsync(sessionURI, JSON.stringify(sessionData));
        }
    };

    useEffect(() => {
        (async () => {        

            let previousAppState = AppState.currentState;

            const handleAppStateChange = async (currentAppState) => {
                if (currentAppState == "background"){
                    await handleInActiveState();
                } else if (currentAppState === 'active' && previousAppState == 'background') {
                    const lastBackgroundTime = await AsyncStorage.getItem('lastBackgroundTime');

                    //if its been more than ten minutes, enforce local authorization
                    if (lastBackgroundTime && (Date.now() - parseInt(lastBackgroundTime, 10)) >= 600000){
                        await navigation.navigate("Lock Screen");
                    } else {
                        const sessionURI = FileSystem.documentDirectory + "session.json";
                        const sessionData = JSON.parse(await FileSystem.readAsStringAsync(sessionURI));
                        sessionData["canAccessSessionID"] = true;
                        await FileSystem.writeAsStringAsync(sessionURI, JSON.stringify(sessionData));
                    }
                }
                previousAppState = currentAppState;
            };
    
            AppState.addEventListener("change", handleAppStateChange);

            return () => {
                AppState.removeEventListener("change", handleAppStateChange);
            };

        })();
    }, []);
}

export default detectAppState;